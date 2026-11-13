import { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, InputGroup, Row, Col, Card, Spinner, Alert } from "react-bootstrap";

const API = "https://api.finna.fi";

export default function Search() {
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        lookfor: query,
        type: "AllFields",
        limit: "24",
      });
      ["id", "title", "year", "images", "formats"].forEach((f) =>
        params.append("field[]", f)
      );

      const response = await fetch(`${API}/v1/search?${params}`);
      if (!response.ok) throw new Error(`Server returned ${response.status}`);

      const data = await response.json();
      setRecords(data.records ?? []);
      setTotal(data.resultCount ?? 0);
      setSearched(true);
    } catch (err) {
      setError(`Search failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h2 className="mb-3">Search Finnish libraries, archives and museums</h2>

      <Form onSubmit={handleSubmit} className="mb-4">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="e.g. Helsinki, Kalevala, Sibelius..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" variant="primary" disabled={loading}>
            Search
          </Button>
        </InputGroup>
      </Form>

      {loading && <Spinner animation="border" role="status" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {searched && !loading && !error && (
        <p className="text-muted">
          {total} results (showing {records.length})
        </p>
      )}

      <Row xs={1} sm={2} md={3} lg={4} className="g-3">
        {records.map((record) => (
          <Col key={record.id}>
            <Card className="h-100">
              {record.images?.length > 0 && (
                <Card.Img
                  variant="top"
                  src={`${API}${record.images[0]}`}
                  alt={record.title}
                  style={{ height: 200, objectFit: "cover" }}
                />
              )}
              <Card.Body>
                <Card.Title className="fs-6">{record.title}</Card.Title>
                <Card.Text className="text-muted small">
                  {record.year && <span>{record.year} · </span>}
                  {record.formats?.[0]?.translated}
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <Link to={`/record/${encodeURIComponent(record.id)}`}>
                  View details
                </Link>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
