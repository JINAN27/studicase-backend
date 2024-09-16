import React from 'react'
import { config } from '../../config'
import { Card, Button } from 'react-bootstrap'
import Tag from '../Tag'
import { useDispatch } from 'react-redux'
import { toggleTags } from '../../app/features/Product/action'
import { formatRupiah } from '../../utils'

export default function CardProduct({ item, onAddToCart }) {
  const dispatch = useDispatch();
  
  // Fallback jika item tidak ada atau tidak lengkap
  if (!item) {
    return <Card><Card.Body>Produk tidak tersedia</Card.Body></Card>
  }

  const { name, image_url, category, tags, price } = item;

  // Validasi untuk menghindari error jika data tidak lengkap
  const categoryName = category?.name || 'Kategori Tidak Diketahui';
  const formattedPrice = formatRupiah(price) || 'Harga Tidak Tersedia';
  
  return (
    <Card>
      <Card.Img variant="top" src={`${config.api_host}/images/products/${image_url}`} style={{ maxHeight: '180px' }} />
      <Card.Body>
        <Card.Title>{name || 'Nama Produk Tidak Tersedia'}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{categoryName}</Card.Subtitle>
        <Tag items={tags || []} onClick={tag => dispatch(toggleTags(tag))} />
        <br />
        <Card.Text>
          {formattedPrice}
        </Card.Text>
        <Button variant="primary" onClick={() => onAddToCart()}>
          Tambah ke Keranjang
        </Button>
      </Card.Body>
    </Card>
  )
}
