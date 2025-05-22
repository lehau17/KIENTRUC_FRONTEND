import ResultsContainer from 'components/results-container/ResultsContainer';
import { format } from 'date-fns';
import { useRooms } from 'hooks/useRooms';
import _debounce from 'lodash/debounce';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAX_GUESTS_INPUT_VALUE } from 'utils/constants';
import HeroCover from './components/hero-cover/HeroCover';

const formatDateForApi = (date) => {
    if (!date) return null; // hoặc '', tùy theo backend
    return format(date, 'yyyy-MM-dd');
};

const Home = () => {
    const navigate = useNavigate();

    // State variables
    const [isDatePickerVisible, setisDatePickerVisible] = useState(false);
    const [locationInputValue, setLocationInputValue] = useState('pune');
    const [numGuestsInputValue, setNumGuestsInputValue] = useState('');

    const {
        data: roomsData,
        isLoading,
        isError,
        error,
    } = useRooms();

    // State for storing available cities
    const [availableCities, setAvailableCities] = useState([]);

    const [filteredTypeheadResults, setFilteredTypeheadResults] = useState([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceFn = useCallback(_debounce(queryResults, 1000), []);

    const [dateRange, setDateRange] = useState([
        {
            startDate: null,
            endDate: null,
            key: 'selection',
        },
    ]);

    const onDatePickerIconClick = () => {
        setisDatePickerVisible(!isDatePickerVisible);
    };



    /**
     * Queries the available cities based on the user's input.
     * @param {string} query - The user's input.
     * @returns {void}
     *
     */
    function queryResults(query, availableCities) {
        const filteredResults = availableCities.filter((city) =>
            city.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredTypeheadResults(filteredResults);
    }

    const onNumGuestsInputChange = (numGuests) => {
        if (
            (numGuests < MAX_GUESTS_INPUT_VALUE && numGuests > 0) ||
            numGuests === ''
        ) {
            setNumGuestsInputValue(numGuests);
        }
    };

    const onDateChangeHandler = (ranges) => {
        setDateRange([ranges.selection]);
    };

    /**
     * Handles the click event of the search button.
     * It gathers the number of guests, check-in and check-out dates, and selected city
     * from the component's state, and then navigates to the '/hotels' route with this data.
     */
    const onSearchButtonAction = () => {
        const numGuest = Number(numGuestsInputValue);
        const checkInDate = formatDateForApi(dateRange[0].startDate);
        const checkOutDate = formatDateForApi(dateRange[0].endDate);
        navigate('/hotels', {
            state: {
                numGuest,
                checkInDate,
                checkOutDate,
            },
        });
    };


    return (
        <>
            <HeroCover
                locationInputValue={locationInputValue}
                numGuestsInputValue={numGuestsInputValue}
                locationTypeheadResults={filteredTypeheadResults}
                isDatePickerVisible={isDatePickerVisible}
                setisDatePickerVisible={setisDatePickerVisible}
                onNumGuestsInputChange={onNumGuestsInputChange}
                dateRange={dateRange}
                onDateChangeHandler={onDateChangeHandler}
                onDatePickerIconClick={onDatePickerIconClick}
                onSearchButtonAction={onSearchButtonAction}
            />
            <div className="container mx-auto">
                <div className="my-8">
                    <h2 className="text-3xl font-medium text-slate-700 text-center my-2">
                        Room for you!!
                    </h2>
                    <ResultsContainer
                        hotelsResults={{
                            isLoading,
                            data: roomsData?.data || [],
                            errors: isError ? [error.message] : [],
                        }}
                        enableFilters={false}
                    />
                </div>
            </div>
        </>
    );
};

export default Home;
