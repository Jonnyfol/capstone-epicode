import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomNavbarUser from "../navbar/navbarUser";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./homePageUser.css";

const HomePageUser = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(localStorage.getItem("avatar"));
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

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
    navigate(`/details-page-user/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3006/post/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setAnnouncements(announcements.filter((a) => a._id !== id));
        setFilteredAnnouncements(
          filteredAnnouncements.filter((a) => a._id !== id)
        );
        // Update company positions count
        const updatedCompanies = companies.map((company) => {
          if (company.positions.includes(id)) {
            company.positions = company.positions.filter(
              (positionId) => positionId !== id
            );
          }
          return company;
        });
        setCompanies(updatedCompanies);
      } else {
        throw new Error("Errore durante l'eliminazione del post");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div className="container-fluid mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="container-fluid mt-4">Error: {error}</div>;
  }

  return (
    <>
      <CustomNavbarUser onSearch={handleSearch} avatarUrl={avatarUrl} />
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
                        {announcement.company.name === username && (
                          <>
                            <Button
                              variant="outline-secondary"
                              className="ml-2"
                              onClick={() => handleEdit(announcement._id)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-danger"
                              className="ml-2"
                              onClick={() => handleDelete(announcement._id)}
                            >
                              <FaTrash />
                            </Button>
                          </>
                        )}
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
                <Card
                  className="mb-3 d-flex justify-content-center"
                  key={company._id}
                >
                  <Row noGutters>
                    <Col md={4}>
                      <Card.Img
                        src={company.avatar}
                        className="card-img measurements"
                        alt={company.company}
                      />
                    </Col>
                    <Col md={8}>
                      <Card.Body>
                        <Card.Title>{company.company}</Card.Title>
                        <Card.Text>Email: {company.email}</Card.Text>
                        <Card.Text>Position: {company.position}</Card.Text>
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
