"use client";
import React, { useState } from "react";

const Pagination = ({ totalItems, setLimit, setPage, itemsPerPageOptions = [10, 20, 30 , 40] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setPage(page);
    }
  };

  const handleItemsPerPageChange = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setItemsPerPage(newLimit);
    setLimit(newLimit);
    setCurrentPage(1);
    setPage(0); // Reset to page 1 when items per page changes
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    const maxPagesToShow = 3;
    const startPage = Math.max(
      1,
      Math.min(
        currentPage - Math.floor(maxPagesToShow / 2),
        totalPages - maxPagesToShow + 1
      )
    );
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`w-8 h-8 rounded-full mx-1 flex items-center justify-center ${
            currentPage === i
              ? "bg-black text-white"
              : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <>
        {startPage > 1 && (
          <>
            <button
              className="w-8 h-8 rounded-full mx-1 flex items-center justify-center bg-gray-200 hover:bg-gray-300"
              onClick={() => handlePageChange(1)}
            >
              1
            </button>
            {startPage > 2 && <span className="mx-1">...</span>}
          </>
        )}
        {pageNumbers}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="mx-1">...</span>}
            <button
              className="w-8 h-8 rounded-full mx-1 flex items-center justify-center bg-gray-200 hover:bg-gray-300"
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row w-full items-center p-4 justify-between">
      {/* Items Per Page Dropdown */}
      <div className="flex items-center space-x-2">
        <span>Items per Page</span>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="p-2 border rounded-md"
        >
          {itemsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-2 mt-4 sm:mt-0">
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {renderPageNumbers()}
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
