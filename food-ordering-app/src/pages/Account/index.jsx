import React from 'react';
import { Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { Routes, Route, useMatch } from 'react-router-dom';  
import { LinkContainer } from 'react-router-bootstrap';
import AddAddress from '../../components/AddAddress';
import Address from '../../components/Address';
import Order from '../../components/Order';
import Profile from '../../components/Profile';
import Logout from '../../components/Logout';

export default function Account() {
  const match = useMatch('/account/*');  // Ganti useRouteMatch dengan useMatch

  return (
    <Container className="mt-5 p-5">
      <Card>
        <Card.Header>
          Account
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <ListGroup>
                <LinkContainer to="/account" exact>
                  <ListGroup.Item action>
                    Profil
                  </ListGroup.Item>
                </LinkContainer>
                <LinkContainer to="/account/orders" exact>
                  <ListGroup.Item action>
                    Pemesanan
                  </ListGroup.Item>
                </LinkContainer>
                <LinkContainer to="/account/address" exact>
                  <ListGroup.Item action>
                    Alamat
                  </ListGroup.Item>
                </LinkContainer>
                <LinkContainer to="/account/logout" exact>
                  <ListGroup.Item action>
                    Logout
                  </ListGroup.Item>
                </LinkContainer>
              </ListGroup>
            </Col>
            <Col md={9}>
              <Routes>
                <Route path="/account" element={<Profile />} exact />
                <Route path="/account/logout" element={<Logout />} exact />
                <Route path="/account/orders" element={<Order />} exact />
                <Route path="/account/address" element={<Address />} />
                <Route path="/account/add-address" element={<AddAddress />} />
              </Routes>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}
