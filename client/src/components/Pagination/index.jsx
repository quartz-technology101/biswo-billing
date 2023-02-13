import React from "react";
import ReactPaginate from "react-paginate";
import { useDispatch } from "react-redux";

const Pagination = ({ pageCount, currentPage, setPageNumber }) => {
  const dispatch = useDispatch();
  const handlePageClick = (data) => {
    let selected = data.selected;
    dispatch(setPageNumber(selected + 1));
  };
  const Common =
    "py-2 px-4 ml-0 leading-tight border-x bg-[#00684be1] border-gray-300 text-white hover:bg-[#00684bc1]";
  return (
    <div className="flex justify-center items-center my-4">
      <ReactPaginate
        className="inline-flex items-center justify-center -space-x-px"
        previousLinkClassName={`${Common} rounded-l-lg`}
        nextLinkClassName={`${Common} rounded-r-lg`}
        pageLinkClassName={`${Common}`}
        breakLinkClassName={`${Common}`}
        activeLinkClassName="py-2 px-3 border-x-0 bg-[#00684ba1] text-white"
        breakLabel="..."
        onPageChange={handlePageClick}
        containerClassName="pagination"
        forcePage={currentPage - 1}
        pageCount={pageCount}
        previousLabel="<"
        nextLabel={">"}
        renderOnZeroPageCount={null}
      />
    </div>
  );
};

export default Pagination;
