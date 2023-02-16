import { Pagination } from "react-bootstrap";
import "./index.scss";
import React, { useState } from "react";

function CustomPagination({ currentPage, totalPages, onPageChange }) {
  const [displayStart, setDisplayStart] = useState(1);
  const ITEMS_PER_PAGE = totalPages > 10 ? 5 : 2;
  const [displayEnd, setDisplayEnd] = useState(ITEMS_PER_PAGE);

  const calculateDisplayRange = (currentPage) => {
    const start = Math.max(1, currentPage - Math.floor(ITEMS_PER_PAGE / 2));
    const end = Math.min(totalPages, start + ITEMS_PER_PAGE - 1);
    setDisplayStart(start);
    setDisplayEnd(end);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      calculateDisplayRange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      calculateDisplayRange(currentPage + 1);
    }
  };

  const displayPageNumbers = [];
  for (let i = displayStart; i <= displayEnd; i++) {
    displayPageNumbers.push(
      <Pagination.Item
        key={i}
        active={currentPage === i}
        onClick={() => onPageChange(i)}
        style={currentPage === i ? { backgroundColor: "#ddd" } : {}}
      >
        {i}
      </Pagination.Item>
    );
  }

  return (
    <Pagination>
      <Pagination.Prev onClick={handlePrevious} disabled={currentPage <= 1} />
      {displayPageNumbers}
      <Pagination.Next
        onClick={handleNext}
        disabled={currentPage >= totalPages}
      />
    </Pagination>
  );
}

export default CustomPagination;
