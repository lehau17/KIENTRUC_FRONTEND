import { useNavigate } from 'react-router-dom';

/**
 * A component that displays a list of popular destinations with their respective image cards.
 * @param {Object} props - The component's props.
 * @param {Object} props.popularDestinationsData - The data for popular destinations.
 * @param {boolean} props.popularDestinationsData.isLoading - Indicates if the data is currently loading.
 * @param {Array<Object>} props.popularDestinationsData.data - The list of popular destination objects, each with the following properties:
 *    @param {number} props.popularDestinationsData.data[].code - The unique code for the destination.
 *    @param {string} props.popularDestinationsData.data[].name - The name of the destination.
 *    @param {string} props.popularDestinationsData.data[].imageUrl - The URL of the destination's image.
 * @param {Array<string>} props.popularDestinationsData.errors - Any errors that occurred while fetching the data.
 */
const PopularLocations = (props) => {
    const { popularDestinationsData } = props;
    const navigate = useNavigate();

    const onPopularDestincationCardClick = (city) => {
        navigate('/hotels', {
            state: {
                city: city.toString().toLowerCase(),
            },
        });
    };

    return (
        <></>
    );
};
export default PopularLocations;
