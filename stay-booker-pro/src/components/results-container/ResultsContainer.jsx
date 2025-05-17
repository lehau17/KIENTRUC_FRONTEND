import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EmptyHotelsState from 'components/empty-hotels-state/EmptyHotelsState';
import HotelViewCardSkeleton from 'components/hotel-view-card-skeleton/HotelViewCardSkeleton';
import HotelViewCard from 'components/hotel-view-card/HotelViewCard';
import VerticalFilters from 'components/vertical-filters/VerticalFilters';
import useOutsideClickHandler from 'hooks/useOutsideClickHandler';
import { useRef, useState } from 'react';
import Select from 'react-select';


// src/data/VerticalFiltersData.js

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



const ResultsContainer = (props) => {
    const {
        hotelsResults,
        enableFilters,
        filtersData,
        onFiltersUpdate,
        onClearFiltersAction,
        sortingFilterOptions,
        sortByFilterValue,
        onSortingFilterChange,
    } = props;

    // Check if sorting filter is visible
    const isSortingFilterVisible =
        sortingFilterOptions && sortingFilterOptions.length > 0;

    const [isVerticalFiltersOpen, setIsVerticalFiltersOpen] = useState(false);

    const wrapperRef = useRef();
    const buttonRef = useRef();

    useOutsideClickHandler(wrapperRef, (event) => {
        if (!buttonRef.current.contains(event.target)) {
            setIsVerticalFiltersOpen(false);
        }
    });

    const toggleVerticalFiltersAction = () => {
        // Toggle based on the current state
        setIsVerticalFiltersOpen((prevState) => !prevState);
    };


    console.log("check home result:>>", hotelsResults)

    return (
        <div className="relative">
            <div className="flex gap-x-0 md:gap-x-4 items-start mx-2">
                {enableFilters && filtersData.length > 0 && (
                    <div ref={wrapperRef}>
                        <VerticalFilters
                            filtersData={filtersData}
                            onFiltersUpdate={onFiltersUpdate}
                            onClearFiltersAction={onClearFiltersAction}
                            isVerticalFiltersOpen={isVerticalFiltersOpen}
                        />
                    </div>
                )}
                <div className="flex flex-col w-full items-start">
                    <div className="flex w-full justify-between px-2 md:px-0">
                        {enableFilters && (
                            <div className="vertical-filters__toggle-menu block md:hidden">
                                <button
                                    ref={buttonRef}
                                    data-testid="vertical-filters__toggle-menu"
                                    onClick={toggleVerticalFiltersAction}
                                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <FontAwesomeIcon icon={faFilter} size="sm" className="mr-1" />{' '}
                                    Filters
                                </button>
                            </div>
                        )}
                        {isSortingFilterVisible && (
                            <Select
                                value={sortByFilterValue}
                                onChange={onSortingFilterChange}
                                options={sortingFilterOptions}
                                className="mb-2 w-[180px] text-sm"
                            />
                        )}
                    </div>

                    <div className="hotels-results__container mx-2 md:mx-0 flex flex-col gap-y-2 w-full">
                        {hotelsResults?.isLoading ? (
                            Array.from({ length: 5 }, (_, index) => (
                                <HotelViewCardSkeleton key={index} />
                            ))
                        ) : hotelsResults?.data?.data?.data?.length > 0 ? (
                            hotelsResults?.data.data?.data?.map((hotel) => (
                                <HotelViewCard
                                    key={hotel._id}
                                    hotel={hotel}
                                />
                            ))
                        ) : (
                            <EmptyHotelsState />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsContainer;
