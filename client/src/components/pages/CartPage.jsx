import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  ShoppingCart,
  Star,
  Trash2,
  CreditCard,
  ArrowLeft,
  CheckCircle,
  Lock,
  Shield,
} from "lucide-react";
import { cartState, userState } from "../../state/atoms";
import ApiService from "../../services/apiService";

const CartPage = () => {
  const [cart, setCart] = useRecoilState(cartState);
  const user = useRecoilValue(userState);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.isAuthenticated) {
      navigate("/login");
    }
  }, [user.isAuthenticated, navigate]);

  const removeFromCart = (courseId) => {
    const courseToRemove = cart.items.find((item) => item.id === courseId);
    setCart((prev) => ({
      items: prev.items.filter((item) => item.id !== courseId),
      total: prev.total - courseToRemove.price,
    }));
    toast.success("Course removed from cart");
  };

  const clearCart = () => {
    setCart({ items: [], total: 0 });
    toast.success("Cart cleared");
  };

  const calculateSubtotal = () => {
    return cart.items.reduce((sum, item) => sum + item.price, 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    const originalTotal = cart.items.reduce(
      (sum, item) => sum + (item.originalPrice || item.price),
      0
    );
    return originalTotal - subtotal;
  };

  const proceedToCheckout = () => {
    if (!user.isAuthenticated) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    if (cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Check for free courses
    const freeCourses = cart.items.filter((item) => item.price === 0);
    if (freeCourses.length === cart.items.length) {
      // All courses are free, enroll directly
      enrollInFreeCourses();
    } else {
      // Show payment modal for paid courses
      setShowPaymentModal(true);
    }
  };

  const enrollInFreeCourses = async () => {
    setLoading(true);
    try {
      // Process free course enrollment
      const enrollmentData = {
        courses: cart.items.map((course) => ({
          courseId: course.id,
          price: 0,
          title: course.title,
        })),
        totalAmount: 0,
        paymentMethod: "free",
      };

      const response = await ApiService.processDummyPayment(enrollmentData);

      if (response.success) {
        toast.success(
          `Successfully enrolled in ${cart.items.length} free course(s)!`
        );
        setCart({ items: [], total: 0 });
        navigate("/dashboard");
      } else {
        throw new Error(response.message || "Enrollment failed");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error(
        error.message || "Failed to enroll in courses. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (paymentData) => {
    // now a normal function
    if (!user || !user._id) {
      toast.error("User not found. Please login again.");
      return;
    }

    try {
      const payload = {
        userId: user._id,
        items: cart.items.map((course) => ({
          courseId: course.id,
          title: course.title,
          price: course.price,
          discountPrice: course.discountPrice || 0,
          finalPrice: course.discountPrice
            ? course.discountPrice
            : course.price,
        })),
        totalAmount: cart.items.reduce((sum, item) => sum + item.price, 0),
        paymentMethod: "dummy",
        paymentData,
      };

      const response = await ApiService.processDummyPayment(payload);

      if (response.data.success) {
        toast.success("Payment successful!");
        setCart({ items: [], total: 0 });
        navigate("/dashboard");
      } else {
        toast.error(response.data.message || "Payment failed");
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Something went wrong during payment");
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingCart className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Browse our courses and add some to your cart
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Browse Courses
          </Link>
        </motion.div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const discount = calculateDiscount();
  const total = subtotal;

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 flex items-center gap-2"
          >
            <Trash2 size={16} />
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {cart.items.map((course) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-24 h-16 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        By {course.instructor}
                      </p>
                      <div className="flex items-center gap-4 mb-3">
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
                        <span className="text-sm text-gray-600">
                          {course.rating}
                        </span>
                        <span className="text-sm text-gray-400">
                          ({course.students?.toLocaleString()} students)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {course.level?.charAt(0).toUpperCase() +
                            course.level?.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {course.duration}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {course.price === 0 ? (
                        <div className="text-lg font-bold text-green-600">
                          Free
                        </div>
                      ) : (
                        <>
                          <div className="text-lg font-bold text-gray-900">
                            ${course.price}
                          </div>
                          {course.originalPrice &&
                            course.originalPrice > course.price && (
                              <div className="text-sm text-gray-400 line-through">
                                ${course.originalPrice}
                              </div>
                            )}
                        </>
                      )}
                      <button
                        onClick={() => removeFromCart(course.id)}
                        className="text-red-600 hover:text-red-700 text-sm mt-2 flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    Subtotal ({cart.items.length} items)
                  </span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-semibold text-green-600">
                      -${discount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={proceedToCheckout}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <CreditCard size={20} />
                    {total === 0 ? "Enroll Now" : "Proceed to Payment"}
                  </>
                )}
              </button>

              <div className="mt-4 text-center text-sm text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <Shield size={16} />
                  30-Day Money-Back Guarantee
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Lock size={16} />
                Secure Checkout
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• SSL encrypted payment</li>
                <li>• 30-day money-back guarantee</li>
                <li>• Lifetime access to courses</li>
                <li>• Mobile and desktop access</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPayment={handlePayment}
        total={total}
        courses={cart.items}
        loading={loading}
      />
    </div>
  );
};

// Dummy Payment Modal Component
const PaymentModal = ({
  isOpen,
  onClose,
  onPayment,
  total,
  courses,
  loading,
}) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: "4242 4242 4242 4242",
    expiryDate: "12/28",
    cvv: "123",
    cardName: "John Doe",
    email: "john@example.com",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onPayment(paymentData);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Complete Payment
          </h2>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {courses.map((course) => (
                <div key={course.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate flex-1 mr-2">
                    {course.title}
                  </span>
                  <span className="font-medium">
                    ${course.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Demo Payment:</strong> This is a dummy payment system
                for demo purposes. The courses will be added to your account
                after "payment".
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={paymentData.email}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                value={paymentData.cardNumber}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    cardNumber: formatCardNumber(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="4242 4242 4242 4242"
                maxLength="19"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={paymentData.expiryDate}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.length >= 2) {
                      value =
                        value.substring(0, 2) + "/" + value.substring(2, 4);
                    }
                    setPaymentData({
                      ...paymentData,
                      expiryDate: value,
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={paymentData.cvv}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      cvv: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123"
                  maxLength="4"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                value={paymentData.cardName}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, cardName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Complete Purchase
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CartPage;
