import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';  
function BreadCrumb({ items }) {
  const navigate = useNavigate();  
  return (
    <Breadcrumb>
      {
        items.map((item, i) => (
          <Breadcrumb.Item 
            key={i} 
            active={i + 1 === items.length} 
            href="#" 
            onClick={() => i + 1 !== items.length ? navigate(item.path) : null}  // Gunakan navigate untuk berpindah halaman
          >
            {item.label}
          </Breadcrumb.Item>
        ))
      }
    </Breadcrumb>
  );
}

BreadCrumb.propTypes = {
  items: PropTypes.array.isRequired
};

export default BreadCrumb;
