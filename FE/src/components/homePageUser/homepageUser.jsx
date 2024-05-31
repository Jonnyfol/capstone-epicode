import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomNavbar from "../navbar/navbar";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const HomePageUser = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch announcements
        const announcementsResponse = await fetch(
          "http://localhost:3006/post",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const announcementsData = await announcementsResponse.json();
        setAnnouncements(announcementsData);
        setFilteredAnnouncements(announcementsData);

        // Fetch companies
        const companiesResponse = await fetch("http://localhost:3006/company", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const companiesData = await companiesResponse.json();
        setCompanies(companiesData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = announcements.filter((announcement) => {
      const titleMatch = announcement.title
        ? announcement.title.toLowerCase().includes(searchTerm.toLowerCase())
        : false;
      const descriptionMatch = announcement.content
        ? announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
        : false;
      return titleMatch || descriptionMatch;
    });
    setFilteredAnnouncements(filtered);
  };

  const handleDetails = (id) => {
    navigate(`/details/${id}`);
  };

  if (loading) {
    return <div className="container-fluid mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="container-fluid mt-4">Error: {error}</div>;
  }

  return (
    <>
      <CustomNavbar onSearch={handleSearch} />
      <Container fluid className="mt-4">
        <Row>
          <Col lg={8} md={7} sm={12}>
            <h2>Announcements</h2>
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((announcement) => (
                <Card className="mb-3" key={announcement._id}>
                  <Row noGutters>
                    <Col md={4}>
                      <Card.Img
                        src={announcement.cover}
                        alt={announcement.title}
                      />
                    </Col>
                    <Col md={8}>
                      <Card.Body>
                        <Card.Title>{announcement.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          {announcement.category}
                        </Card.Subtitle>
                        <Card.Text>
                          {announcement.content.slice(0, 100)}...
                        </Card.Text>
                        <Card.Text>
                          <small className="text-muted">
                            {announcement.company.name}
                          </small>
                          <br />
                          <small className="text-muted">
                            Tempo di lettura: {announcement.readTime.value}{" "}
                            {announcement.readTime.unit}
                          </small>
                        </Card.Text>
                        <Button
                          variant="primary"
                          onClick={() => handleDetails(announcement._id)}
                        >
                          Dettagli
                        </Button>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              ))
            ) : (
              <p>No announcements available</p>
            )}
          </Col>
          <Col lg={4} md={5} sm={12}>
            <h2>Companies</h2>
            {companies.length > 0 ? (
              companies.map((company) => (
                <Card className="mb-3" key={company._id}>
                  <Row noGutters>
                    <Col md={4}>
                      <Card.Img
                        src={company.avatar}
                        className="card-img"
                        alt={company.company}
                      />
                    </Col>
                    <Col md={8}>
                      <Card.Body>
                        <Card.Title>{company.company}</Card.Title>
                        <Card.Text>Email: {company.email}</Card.Text>
                        <Card.Text>Position: {company.position}</Card.Text>
                        <Card.Text>
                          Open positions:{" "}
                          {company.positions
                            ? company.positions.join(", ")
                            : "No positions available"}
                        </Card.Text>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              ))
            ) : (
              <p>No companies available</p>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomePageUser;
