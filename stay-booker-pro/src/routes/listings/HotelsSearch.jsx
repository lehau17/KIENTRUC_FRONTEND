import ResultsContainer from 'components/results-container/ResultsContainer';
import PaginationController from 'components/ux/pagination-controller/PaginationController';
import { useRooms } from 'hooks/useRooms'; // <-- Tối ưu gọi API Rooms
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SORTING_FILTER_LABELS } from 'utils/constants';

// Filter cứng
export const VerticalFiltersData = [
    {
        filterId: "price",
        title: "Price",
        filters: [
            { id: "from_price", title: "From Price", value: 0, isSelected: false },
            { id: "to_price", title: "To Price", value: 1000, isSelected: false },
        ],
    },
    {
        filterId: "roomType",
        title: "Room Type",
        filters: [
            { id: "standard", title: "Standard", value: "standard", isSelected: false },
            { id: "deluxe", title: "Deluxe", value: "deluxe", isSelected: false },
            { id: "suite", title: "Suite", value: "suite", isSelected: false },
        ],
    },
    {
        filterId: "status",
        title: "Status",
        filters: [
            { id: "available", title: "Available", value: "available", isSelected: false },
            { id: "unavailable", title: "Unavailable", value: "unavailable", isSelected: false },
        ],
    },
    {
        filterId: "rating",
        title: "Rating",
        filters: [
            { id: "1_star", title: "1 Star", value: 1, isSelected: false },
            { id: "2_star", title: "2 Stars", value: 2, isSelected: false },
            { id: "3_star", title: "3 Stars", value: 3, isSelected: false },
            { id: "4_star", title: "4 Stars", value: 4, isSelected: false },
            { id: "5_star", title: "5 Stars", value: 5, isSelected: false },
        ],
    },
];

const HotelsSearch = () => {
    // State
    const [currentResultsPage, setCurrentResultsPage] = useState(1);
    const [filtersData, setFiltersData] = useState(VerticalFiltersData);
    const [sortByFilterValue, setSortByFilterValue] = useState({
        value: 'default',
        label: 'Sort by',
    });

    const [searchParams, setSearchParams] = useSearchParams();

    const getActiveFilters = () => {
        const filters = {};
        filtersData.forEach((category) => {
            const selectedValues = category.filters
                .filter((filter) => filter.isSelected)
                .map((filter) => filter.value);

            if (selectedValues.length > 0) {
                filters[category.filterId] = selectedValues;
            }
        });
        return filters;
    }
    // Query TanStack
    const { data, isLoading } = useRooms({
        page: currentResultsPage,
        limit: 40,
        sortBy: sortByFilterValue.value,
        ...getActiveFilters(),
    });

    // Sort Options
    const sortingFilterOptions = [
        { value: 'default', label: 'Sort by' },
        { value: 'priceLowToHigh', label: SORTING_FILTER_LABELS.PRICE_LOW_TO_HIGH },
        { value: 'priceHighToLow', label: SORTING_FILTER_LABELS.PRICE_HIGH_TO_LOW },
    ];

    // Cập nhật Filter
    const onFiltersUpdate = (updatedFilter) => {
        setFiltersData((prevData) =>
            prevData.map((filterGroup) =>
                filterGroup.filterId === updatedFilter.filterId
                    ? {
                        ...filterGroup,
                        filters: filterGroup.filters.map((filter) =>
                            filter.id === updatedFilter.id
                                ? { ...filter, isSelected: !filter.isSelected }
                                : filter
                        ),
                    }
                    : filterGroup
            )
        );
    };



    // Pagination
    const handlePageChange = (page) => {
        setCurrentResultsPage(page);
    };

    console.log("data ở hotel search", data)

    return (
        <div className="hotels">
            <div className="my-4"></div>
            <ResultsContainer
                hotelsResults={data}
                enableFilters={true}
                filtersData={filtersData}
                onFiltersUpdate={onFiltersUpdate}
                onClearFiltersAction={() => setFiltersData(VerticalFiltersData)}
                sortByFilterValue={sortByFilterValue}
                onSortingFilterChange={setSortByFilterValue}
                sortingFilterOptions={sortingFilterOptions}
            />
            {data?.pagination?.totalPages > 1 && (
                <div className="my-4">
                    <PaginationController
                        currentPage={currentResultsPage}
                        totalPages={data.data.pagination.totalPages}
                        handlePageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default HotelsSearch;
