import React from "react";

const CartPage = () => {
  const [cart, setCart] = useRecoilState(cartState);
  const total = useRecoilValue(cartTotalSelector);

  const removeFromCart = (courseId) => {
    setCart((prev) => ({
      items: prev.items.filter((item) => item._id !== courseId),
      total: prev.total - prev.items.find((item) => item._id === courseId).price,
    }));
    toast.success("Course removed from cart");
  };

  const proceedToCheckout = () => {
    toast.success("Redirecting to payment...");
    // Implement checkout logic
  };

  if (cart.items.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Browse our courses and add some to your cart
          </p>
          <Link
            to="/courses"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.items.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-24 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      By {course.instructor}
                    </p>
                    <div className="flex items-center gap-2">
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
                        ({course.students.toLocaleString()} students)
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      ${course.price}
                    </div>
                    <div className="text-sm text-gray-400 line-through">
                      ${course.originalPrice}
                    </div>
                    <button
                      onClick={() => removeFromCart(course._id)}
                      className="text-red-600 hover:text-red-700 text-sm mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  Subtotal ({cart.items.length} items)
                </span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="font-semibold text-green-600">
                  -$
                  {(
                    cart.items.reduce(
                      (sum, item) => sum + item.originalPrice,
                      0
                    ) - total
                  ).toFixed(2)}
                </span>
              </div>
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
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Proceed to Checkout
            </button>

            <div className="mt-4 text-center text-sm text-gray-500">
              30-Day Money-Back Guarantee
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
