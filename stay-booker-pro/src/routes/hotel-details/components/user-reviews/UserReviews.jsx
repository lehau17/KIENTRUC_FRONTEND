import Loader from 'components/ux/loader/loader';
import Toast from 'components/ux/toast/Toast';
import { useCreateReview, useRoomReviews } from 'hooks/useReview';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import RatingsOverview from './components/RatingsOverview';
import Review from './components/Review';
import UserRatingsSelector from './components/UserRatingsSelector';

/**
 * Renders the user reviews component.
 *
 * @component
 * @param {Object} reviewData - The review data object.
 * @returns {JSX.Element} The user reviews component.
 */
const UserReviews = ({
    handlePageChange,
    handlePreviousPageChange,
    handleNextPageChange,
}) => {
    const { hotelId } = useParams();
    const [userRating, setUserRating] = useState(0);
    const [userReview, setUserReview] = useState('');
    const [shouldHideUserRatingsSelector, setShouldHideUserRatingsSelector] =
        useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // 🚀 Sử dụng hook lấy reviews
    const { data: reviewDataHook, isLoading, refetch } = useRoomReviews(hotelId);

    // 🚀 Sử dụng hook tạo review
    const { mutate: createReview } = useCreateReview();

    /**
     * Handles the selected user rating.
     * @param {number} rate - The rating value.
     */
    const handleRating = (rate) => {
        setUserRating(rate);
    };

    const clearToastMessage = () => {
        setToastMessage('');
    };

    const handleReviewSubmit = async () => {
        if (userRating === 0 || userReview.trim() === '') {
            setToastMessage({
                type: 'error',
                message: 'Please provide a rating and a review before submitting.',
            });
            return;
        }

        createReview(
            {
                roomId: hotelId,
                review: {
                    content: userReview,
                    rating: userRating,
                },
            },
            {
                onSuccess: () => {
                    setToastMessage({
                        type: 'success',
                        message: 'Review submitted successfully.',
                    });
                    refetch();
                    setShouldHideUserRatingsSelector(true);
                },
                onError: () => {
                    setToastMessage({
                        type: 'error',
                        message: 'Review submission failed.',
                    });
                },
            }
        );
    };

    const handleUserReviewChange = (review) => {
        setUserReview(review);
    };

    const isEmpty = reviewDataHook?.data?.length === 0;

    // 🚀 Tính toán tổng rating và số lượng sao
    const totalReviews = reviewDataHook?.data?.length ?? 0;

    const averageRating = totalReviews > 0
        ? (reviewDataHook.data.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
        : 0;

    const starCounts = [1, 2, 3, 4, 5].map((star) =>
        reviewDataHook?.data?.filter((review) => review.rating === star).length
    );

    return (
        <div className="flex flex-col p-4 border-t">
            <h1 className="text-xl font-bold text-gray-700">User Reviews</h1>
            <div className="flex flex-col md:flex-row py-4 bg-white shadow-sm gap-6">
                {totalReviews === 0 ? (
                    <div className="w-3/5">
                        <span className="text-gray-500 italic">
                            Be the first to leave a review!
                        </span>
                    </div>
                ) : (
                    <RatingsOverview
                        averageRating={averageRating}
                        ratingsCount={totalReviews}
                        starCounts={starCounts}
                    />
                )}
                {shouldHideUserRatingsSelector ? null : (
                    <UserRatingsSelector
                        userRating={userRating}
                        isEmpty={isEmpty}
                        handleRating={handleRating}
                        userReview={userReview}
                        handleReviewSubmit={handleReviewSubmit}
                        handleUserReviewChange={handleUserReviewChange}
                    />
                )}
            </div>
            {toastMessage && (
                <Toast
                    type={toastMessage.type}
                    message={toastMessage.message}
                    dismissError={clearToastMessage}
                />
            )}
            <div>
                {isLoading ? (
                    <Loader height={'600px'} />
                ) : (
                    <div>
                        {reviewDataHook?.data?.map((review, index) => (
                            <Review
                                key={index}
                                reviewerName={review.user.name}
                                reviewDate={review.createdAt}
                                review={review.comment}
                                rating={review.rating}
                                verified={review.verified}
                            />
                        ))}
                    </div>
                )}
            </div>
            {/* {totalReviews > 0 && (
                <PaginationController
                    currentPage={reviewDataHook.pagination.currentPage}
                    totalPages={reviewDataHook.pagination.totalPages}
                    handlePageChange={handlePageChange}
                    handlePreviousPageChange={handlePreviousPageChange}
                    handleNextPageChange={handleNextPageChange}
                />
            )} */}
        </div>
    );
};

export default UserReviews;
