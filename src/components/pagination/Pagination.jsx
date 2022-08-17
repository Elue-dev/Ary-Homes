import { useState } from "react";
import  "./pagination.scss";

export default function Pagination({
  currentPage,
  setCurrentPage,
  propertiesPerPage,
  totalProducts,
}) {
  const pageNumbers = [];
  const totalPages = totalProducts / propertiesPerPage;
  //limit page numbers shown
  const [pageNumberLimit] = useState(5);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

  //paginate
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scroll(0, 0);
  };

  //go to next page
  const paginateNext = () => {
    setCurrentPage(currentPage + 1);
    window.scroll(0, 0);

    // Show next set of pageNumbers
    if (currentPage + 1 > maxPageNumberLimit) {
      setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };

  const paginatePrev = () => {
    setCurrentPage(currentPage - 1);
     window.scroll(0, 0);
    // Show prev set of pageNumbers
    if ((currentPage - 1) % pageNumberLimit === 0) {
      setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };

  //go to next page

  for (let i = 1; i <= Math.ceil(totalProducts / propertiesPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <ul className="pagination">
      <li
        onClick={paginatePrev}
        className={currentPage === pageNumbers[0] ? `hidden` : null}
      >
        Prev
      </li>
      {pageNumbers.map((number) => {
        if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
          return (
            <li
              key={number}
              onClick={() => paginate(number)}
              className={currentPage === number ? `active` : null}
            >
              {number}
            </li>
          );
        }
      })}
      <li
        onClick={paginateNext}
        className={
          currentPage === pageNumbers[pageNumbers.length - 1] ? `hidden` : null
        }
      >
        Next
      </li>
      <p>
        <b className="page">{`page ${currentPage}`}</b>
        &nbsp; <span>of</span>
        &nbsp; <b>{`${Math.ceil(totalPages)}`}</b>
      </p>
    </ul>
  );
}
