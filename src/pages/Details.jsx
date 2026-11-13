import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Row, Col, Button, Badge, Spinner, Alert } from "react-bootstrap";
import useCollection from "../useCollection";

const API = "https://api.finna.fi";

export default function Details() {
  const { id } = useParams();
  const { has, add, remove } = useCollection();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecord() {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({ id });
        ["id", "title", "year", "images", "formats", "buildings", "subjects", "summary", "nonPresenterAuthors"].forEach(
          (f) => params.append("field[]", f)
        );

        const response = await fetch(`${API}/v1/record?${params}`);
        if (!response.ok) throw new Error(`Server returned ${response.status}`);

        const data = await response.json();
        if (!data.records || data.records.length === 0) {
          throw new Error("Record not found");
        }
        setRecord(data.records[0]);
      } catch (err) {
        setError(`Could not load record: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    loadRecord();
  }, [id]);

  if (loading) return <Spinner animation="border" role="status" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  const saved = has(record.id);

  function toggleSaved() {
    if (saved) {
      remove(record.id);
    } else {
      add({
        id: record.id,
        title: record.title,
        year: record.year ?? null,
        image: record.images?.[0] ?? null,
        format: record.formats?.[0]?.translated ?? "Unknown",
      });
    }
  }

  return (
    <>
      <Link to="/">&larr; Back to search</Link>

      <Row className="mt-3 g-4">
        <Col md={5}>
          {record.images?.length > 0 ? (
            <img
              src={`${API}${record.images[0]}`}
              alt={record.title}
              className="img-fluid rounded"
            />
          ) : (
            <div className="text-muted">No image available</div>
          )}
        </Col>

        <Col md={7}>
          <h2>{record.title}</h2>

          <p className="text-muted">
            {record.year && <span>{record.year} · </span>}
            {record.formats?.[0]?.translated}
          </p>

          {record.nonPresenterAuthors?.length > 0 && (
            <p>
              <strong>Authors:</strong>{" "}
              {record.nonPresenterAuthors.map((a) => a.name).join(", ")}
            </p>
          )}

          {record.summary?.length > 0 && <p>{record.summary[0]}</p>}

          {record.buildings?.length > 0 && (
            <p>
              <strong>Held by:</strong> {record.buildings[0].translated}
            </p>
          )}

          {record.subjects?.length > 0 && (
            <div className="mb-3">
              {record.subjects.slice(0, 8).map((s, i) => (
                <Badge key={i} bg="secondary" className="me-1">
                  {s.join(" - ")}
                </Badge>
              ))}
            </div>
          )}

          <Button variant={saved ? "outline-danger" : "success"} onClick={toggleSaved} className="me-2">
            {saved ? "Remove from collection" : "Add to my collection"}
          </Button>

          <Button
            variant="outline-primary"
            href={`https://www.finna.fi/Record/${encodeURIComponent(record.id)}`}
            target="_blank"
            rel="noreferrer"
          >
            Open in Finna
          </Button>
        </Col>
      </Row>
    </>
  );
}
