import React, { useState } from "react";
import { Container, Row, Col, Button, ListGroup } from "react-bootstrap";
import classNames from "classnames";

import API from "../api";
import { useCopyClipboard } from "../hooks";

const Form = () => {
  const [data, setData] = useState("");
  const [url, setUrl] = useState([]);
  const [error, setError] = useState("");

  const [isCopied, copyClipboard] = useCopyClipboard();

  const btnClass = classNames("copy-btn", {
    worked: isCopied,
  });

  const handleCopy = (val, e) => {
    e.target.innerText = "Copied!";

    copyClipboard(val);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (data === "") {
      setError("Please add a link");
      return;
    }

    const {
      data: { result },
    } = await API.get("/shorten", {
      params: {
        url: data,
      },
    });

    setUrl([
      ...url,
      {
        real: result.original_link,
        short: result.full_short_link,
      },
    ]);

    setData("");
    setError("");
  };

  return (
    <section id="form">
      <Container>
        <Row className="justify-content-center">
          <Col md="8">
            <form id="term-form" onSubmit={handleFormSubmit}>
              <div className="d-flex">
                <input
                  className={`form-control form-input ${
                    error === "" ? "" : "is-validation"
                  }`}
                  placeholder="Shorthen a link here.."
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />
                <Button type="submit">Shorten it!</Button>
              </div>
              {<p className="text-danger text-validation">{error}</p>}
            </form>
            <ListGroup>
              {url?.map((item, index) => {
                return (
                  <ListGroup.Item key={index + 1} className="mt-3">
                    <Row className="align-items-center">
                      <Col lg="6" md="6" className="link-response-left">
                        {item.real}
                      </Col>
                      <Col lg="6" md="6" className="link-response-right">
                        <a
                          href={item.short}
                          target="_blank"
                          rel="noreferrer"
                          className="me-3"
                          style={{ color: "#2CD0CE" }}
                        >
                          {item.short}
                        </a>
                        <Button
                          variant={"warning"}
                          className={btnClass}
                          onClick={(e) => handleCopy(item.short, e)}
                        >
                          Copy
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Form;
