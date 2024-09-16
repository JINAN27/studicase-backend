import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'react-bootstrap';
import { useSelector } from 'react-redux';

function Tag({ items, onClick }) {
  const products = useSelector(state => state.products);

  // Tambahkan pengecekan jika `items` bukan array
  if (!Array.isArray(items)) {
    return null; // Atau tampilkan pesan error, tergantung kebutuhan
  }

  return (
    <>
      {
        items.map((item, i) => (
          <Badge 
            pill 
            bg={products.tags.includes(item.name) ? 'warning' : 'secondary'} 
            style={{fontSize: '60%', cursor: 'pointer'}} 
            key={i}
            onClick={() => onClick(item.name)}
          >
            {item.name}
          </Badge>
        ))
      }
    </>
  );
}

Tag.propTypes = {
  items: PropTypes.array.isRequired,
};

export default Tag;
