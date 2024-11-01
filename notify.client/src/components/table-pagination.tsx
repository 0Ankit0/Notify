// components/Pagination.tsx
import { Button } from "@/components/ui/button";

type PaginationProps = {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  paginate: (pageNumber: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
};

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  paginate,
  setItemsPerPage,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="mt-4 flex justify-between items-center">
      <div>
        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          className="w-[100px]"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
      <div>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            variant={currentPage === i + 1 ? "default" : "outline"}
            className="mx-1"
            onClick={() => paginate(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Pagination;
