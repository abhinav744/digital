import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>An ecommerce website is an online platform where businesses sell products or services to customers over the internet. These websites facilitate transactions between buyers and sellers, allowing customers to browse, select, and purchase items conveniently from the comfort of their own homes or any location with internet access.</p>
        <p>Ecommerce websites have become increasingly popular due to their convenience, accessibility, and wide selection of products available to consumers worldwide. </p>
      </div>
    </div>
  )
}

export default DescriptionBox
