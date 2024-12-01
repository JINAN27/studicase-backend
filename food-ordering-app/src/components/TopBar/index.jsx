import React, { useEffect, useState } from 'react';
import { Container, Form, FormControl, Nav, Navbar, Button, NavDropdown, InputGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { getCategories } from '../../app/api/product';
import { useDispatch, useSelector } from 'react-redux';
import { setCategory, setKeyword } from '../../app/features/Product/action';
import { totalItemCart } from '../../utils';

export default function TopBar() {
  const [categories, setCategories] = useState([]);
  const products = useSelector(state => state.products);
  const cart = useSelector(state => state.cart);
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    getCategories()
      .then(({ data }) => setCategories(data))
  }, []);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <LinkContainer to="/" exact>
          <Navbar.Brand>POS</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0 mr-3">
            <NavDropdown title={products.category || 'Kategori'} id="navbarScrollingDropdown">
              {
                categories.map((category, i) => (
                  <NavDropdown.Item
                    href="#"
                    key={i}
                    active={category.name === products.category}
                    onClick={() => dispatch(setCategory(category.name))}
                  >{category.name}</NavDropdown.Item>
                ))
              }
            </NavDropdown>
          </Nav>
          <Form className="d-flex w-75">
            <InputGroup>
              <FormControl type="text" placeholder="Cari barang..." onChange={e => dispatch(setKeyword(e.target.value))} />
              <Button variant="outline-light">
                {/* Ganti FontAwesomeIcon dengan emoji */}
                🔍
              </Button>
            </InputGroup>
          </Form>
          <Nav>
            <LinkContainer to="/cart" style={{ marginRight: '20px' }}>
              <Nav.Link className="position-relative" title="Keranjang belanja" >
                {/* Ganti FontAwesomeIcon dengan emoji */}
                🛒
                <span className="position-absolute top-10 start-100 translate-middle badge rounded-pill bg-danger">
                  {totalItemCart(cart)}
                  <span className="visually-hidden">Total item</span>
                </span>
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to={auth.user ? '/account' : '/login'}>
              <Nav.Link title="Profil">
                {/* Ganti FontAwesomeIcon dengan emoji */}
                👤
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
