import { Link } from "react-router-dom";
import { Row, Col, Card, Button, Alert } from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import useCollection from "../useCollection";

const API = "https://api.finna.fi";

export default function Collection() {
  const { items, remove } = useCollection();

  if (items.length === 0) {
    return (
      <>
        <h2>My collection</h2>
        <Alert variant="info">
          Your collection is empty. <Link to="/">Search for records</Link> and add some.
        </Alert>
      </>
    );
  }

  
  const counts = {};
  items.forEach((item) => {
    counts[item.format] = (counts[item.format] || 0) + 1;
  });
  const chartData = Object.entries(counts).map(([format, count]) => ({
    format,
    count,
  }));

  return (
    <>
      <h2>My collection ({items.length})</h2>

      <h5 className="mt-4">Items by format</h5>
      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="format" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#0d6efd" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Row xs={1} sm={2} md={3} lg={4} className="g-3 mt-2">
        {items.map((item) => (
          <Col key={item.id}>
            <Card className="h-100">
              {item.image && (
                <Card.Img
                  variant="top"
                  src={`${API}${item.image}`}
                  alt={item.title}
                  style={{ height: 200, objectFit: "cover" }}
                />
              )}
              <Card.Body>
                <Card.Title className="fs-6">{item.title}</Card.Title>
                <Card.Text className="text-muted small">
                  {item.year && <span>{item.year} · </span>}
                  {item.format}
                </Card.Text>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between">
                <Link to={`/record/${encodeURIComponent(item.id)}`}>Details</Link>
                <Button variant="outline-danger" size="sm" onClick={() => remove(item.id)}>
                  Remove
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}