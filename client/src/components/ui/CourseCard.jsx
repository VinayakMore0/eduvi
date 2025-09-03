import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { cartState, userState, wishlistState } from "../../state/atoms";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Heart, Play, Star } from "lucide-react";
import toast from "react-hot-toast";

const CourseCard = ({ course }) => {
  const [cart, setCart] = useRecoilState(cartState);
  const [wishlist, setWishlist] = useRecoilState(wishlistState);
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  const addToCart = () => {
    if (!user.isAuthenticated) {
      toast.error("Please login to add courses to cart");
      navigate("/login");
      return;
    }

    const isAlreadyInCart = cart.items.some((item) => item.id === course.id);
    if (isAlreadyInCart) {
      toast.error("Course already in cart");
      return;
    }

    setCart((prev) => ({
      items: [...prev.items, course],
      total: prev.total + course.price,
    }));
    toast.success("Course added to cart!");
  };

  const toggleWishlist = () => {
    if (!user.isAuthenticated) {
      toast.error("Please login to save courses");
      navigate("/login");
      return;
    }

    const isInWishlist = wishlist.includes(course.id);
    if (isInWishlist) {
      setWishlist((prev) => prev.filter((id) => id !== course.id));
      toast.success("Removed from wishlist");
    } else {
      setWishlist((prev) => [...prev, course.id]);
      toast.success("Added to wishlist!");
    }
  };

  const discount = (
    ((course.originalPrice - course.price) / course.originalPrice) *
    100
  ).toFixed(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
    >
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {course.bestseller && (
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Bestseller
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {discount}% OFF
            </span>
          )}
        </div>
        <button
          onClick={toggleWishlist}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart
            className={`${
              wishlist.includes(course.id)
                ? "text-red-500 fill-current"
                : "text-gray-600"
            }`}
            size={20}
          />
        </button>
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => navigate(`/course/${course.id}`)}
            className="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <Play size={16} />
            Preview
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
          </span>
          <span className="text-sm text-gray-500">{course.duration}</span>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`${
                  i < Math.floor(course.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
                size={14}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">{course.rating}</span>
          <span className="text-sm text-gray-400">
            ({course.students.toLocaleString()} students)
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">By {course.instructor}</div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 line-through">
              ${course.originalPrice}
            </span>
            <span className="text-2xl font-bold text-gray-900">
              ${course.price}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={addToCart}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </button>
          <button
            onClick={() => navigate(`/course/${course.id}`)}
            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BookOpen size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
