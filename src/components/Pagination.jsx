import "./Pagination.css";

export function Pagination({
  currentPage,
  totalPages,
  onPrev,          
  onNext,
  onPageSizeChange 
}) {
  return (
    <>
      <div className="pagess">
       
        <select 
          className="select" 
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          defaultValue="10" 
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>

        <button
          className="buttonprev"
          onClick={onPrev}
          disabled={currentPage === 1}
        >
          PREV
        </button>

        <span className="label">
          {currentPage} of {totalPages}
        </span>

        <button
          className="buttonnext"
          onClick={onNext}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          NEXT
        </button>
      </div>
    </>
  );
}