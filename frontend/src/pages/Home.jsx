import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  ShoppingCart,
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  X,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);
  const [rentDays, setRentDays] = useState(7);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const booksPerPage = 8;
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/books");
      if (res.data.length > 0) {
        setBooks(res.data);
      } else {
        setBooks([
          {
            bookId: 101,
            bookName: "The Pragmatic Programmer",
            author: "Andy Hunt",
            price: 950.5,
            bookCategory: "Programming",
            status: "Available",
          },
          {
            bookId: 102,
            bookName: "Clean Code",
            author: "Robert C. Martin",
            price: 1200.75,
            bookCategory: "Programming",
            status: "Available",
          },
          {
            bookId: 103,
            bookName: "Atomic Habits",
            author: "James Clear",
            price: 450.0,
            bookCategory: "Non-Fiction",
            status: "Available",
          },
        ]);
      }
    } catch (err) {
      console.error("Error fetching books", err);
    } finally {
      setLoading(false);
    }
  };

  const openRentModal = (book) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (book.amountInStock <= 0 && book.amountInStock !== undefined) {
      showToast("Book is out of stock!", true);
      return;
    }
    setSelectedBook(book);
    setRentDays(7);
    setIsModalOpen(true);
  };

  const handleRentConfirm = async () => {
    try {
      // Create FormData as the backend expects @RequestParam
      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("bookId", selectedBook.bookId);
      formData.append("note", `Rented for ${rentDays} days`);
      formData.append("date", new Date().toISOString().split("T")[0]);
      formData.append("rentDays", rentDays);

      await axios.post("http://localhost:8081/api/borrow", formData);
      showToast(
        `Successfully rented ${selectedBook.bookName} for ${rentDays} days!`,
      );
      setIsModalOpen(false);
      fetchBooks(); // Refresh stock
    } catch (err) {
      showToast(
        err.response?.data || "Failed to rent book. Please try again.",
        true,
      );
    }
  };

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(""), 3000);
  };

  const filteredBooks = books.filter(
    (b) =>
      b.bookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookCategory.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const currentBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage,
  );

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  // Get a specific image based on upload or fallback to unsplash
  const getCoverImage = (book, index) => {
    // If the admin uploaded a real cover, it will be saved as something like 12345_cover.jpg in public/books
    if (book.photoName && book.photoName !== "default.jpg" && book.photoName !== "") {
      return `/books/${book.photoName}`;
    }
    
    // Otherwise, fallback to the nice Unsplash placeholders
    const defaultIds = [
      "1544947950-fa07a98d237f", // Books 1
      "1512820790803-83ca734da794", // Books 2
      "1495446815901-a7297e633e8d", // Books 3
      "1491841550275-ad7854e35ca6", // Books 4
    ];

    if (book.bookCategory === "Programming")
      return `https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80`;
    if (book.bookCategory === "Fiction")
      return `https://images.unsplash.com/photo-1474932430478-367d16b99031?auto=format&fit=crop&w=600&q=80`;
    if (book.bookCategory === "Business & Economics")
      return `https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80`;

    // Cycle through defaults for others based on index
    return `https://images.unsplash.com/photo-${defaultIds[index % defaultIds.length]}?auto=format&fit=crop&w=600&q=80`;
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f8f9fa" }}>
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: toast.isError ? "#e03e3e" : "#588157",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "8px",
            zIndex: 1000,
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            fontWeight: "500",
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* Hero Section */}
      <div
        style={{
          position: "relative",
          width: "100%",
          padding: "100px 20px",
          textAlign: "center",
          background: "#344e41",
          overflow: "hidden",
        }}
      >
        {/* Background Image with Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.2,
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to bottom, rgba(52, 78, 65, 0.8), #344e41)",
          }}
        ></div>

        <div
          className="container"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "6px 16px",
              background: "rgba(218, 215, 205, 0.2)",
              backdropFilter: "blur(10px)",
              color: "#dad7cd",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "24px",
              border: "1px solid rgba(218, 215, 205, 0.3)",
            }}
          >
            🌿 Curated Knowledge Collection
          </div>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: "800",
              color: "#f8f9fa",
              lineHeight: "1.2",
              marginBottom: "24px",
              letterSpacing: "-1px",
            }}
          >
            Discover Your Next{" "}
            <span style={{ color: "#a3b18a" }}>Great Read</span>
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "#ced4da",
              marginBottom: "40px",
              lineHeight: "1.6",
            }}
          >
            Explore thousands of premium books across programming, business,
            fiction, and more. Find exactly what you need to level up your
            knowledge.
          </p>

          {/* Glassmorphic Search Bar */}
          <div
            style={{
              position: "relative",
              maxWidth: "600px",
              margin: "0 auto",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "16px",
              padding: "6px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "20px",
                transform: "translateY(-50%)",
                color: "#dad7cd",
              }}
            >
              <Search size={22} />
            </div>
            <input
              type="text"
              placeholder="Search by book name, author, or category..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                width: "100%",
                padding: "16px 20px 16px 54px",
                fontSize: "16px",
                border: "none",
                background: "transparent",
                color: "#fff",
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* Books Section */}
      <div
        className="container"
        style={{ padding: "60px 40px", maxWidth: "1400px", margin: "0 auto" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#344e41",
                marginBottom: "8px",
              }}
            >
              {searchQuery ? "Search Results" : "Trending Books"}
            </h2>
            <p style={{ color: "#588157" }}>
              {filteredBooks.length} books found
            </p>
          </div>
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px",
              color: "#588157",
              fontSize: "18px",
            }}
          >
            Loading our premium collection...
          </div>
        ) : filteredBooks.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px",
              background: "rgba(218, 215, 205, 0.3)",
              borderRadius: "16px",
              border: "1px dashed #a3b18a",
            }}
          >
            <Search
              size={48}
              color="#588157"
              style={{ margin: "0 auto 16px" }}
            />
            <h3
              style={{
                fontSize: "20px",
                color: "#3a5a40",
                marginBottom: "8px",
              }}
            >
              No books found
            </h3>
            <p style={{ color: "#588157" }}>
              Try adjusting your search terms or exploring a different category.
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "30px",
                marginBottom: "50px",
              }}
            >
              {currentBooks.map((b, index) => (
                <div
                  key={b.bookId}
                  style={{
                    background: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    boxShadow: "0 4px 15px rgba(52, 78, 65, 0.08)",
                    transition: "all 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 24px rgba(52, 78, 65, 0.15)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow =
                      "0 4px 15px rgba(52, 78, 65, 0.08)";
                  }}
                >
                  {/* HD Image Cover */}
                  <div
                    style={{
                      height: "220px",
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    <img
                      src={getCoverImage(b, index)}
                      alt={b.bookName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          "linear-gradient(to bottom, transparent, rgba(52, 78, 65, 0.8))",
                      }}
                    ></div>

                    {/* Overlay Category Tag */}
                    <div
                      style={{
                        position: "absolute",
                        top: "16px",
                        left: "16px",
                        background: "rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(8px)",
                        color: "#fff",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                      }}
                    >
                      {b.bookCategory}
                    </div>

                    {/* Title and Author over image */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "16px",
                        left: "16px",
                        right: "16px",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "18px",
                          fontWeight: "700",
                          color: "#fff",
                          marginBottom: "4px",
                          lineHeight: "1.3",
                          textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                        }}
                      >
                        {b.bookName}
                      </h3>
                      <p
                        style={{
                          color: "#e0e1dd",
                          fontSize: "13px",
                          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                        }}
                      >
                        By {b.author}
                      </p>
                    </div>
                  </div>

                  {/* Book Details Bottom Half */}
                  <div
                    style={{
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      background: "#fff",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "13px",
                        marginBottom: "20px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background:
                            b.status === "Available" ? "#588157" : "#ef4444",
                        }}
                      ></div>
                      <span style={{ color: "#588157", fontWeight: "500" }}>
                        {b.status || "Available"}
                      </span>
                    </div>

                    {/* Beautiful Add to Cart Row */}
                    <div
                      style={{
                        marginTop: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderTop: "1px solid #e9ecef",
                        paddingTop: "16px",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#588157",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Price / Day
                        </span>
                        <span
                          style={{
                            fontSize: "22px",
                            fontWeight: "800",
                            color: "#344e41",
                          }}
                        >
                          ₹{parseFloat(b.price).toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openRentModal(b);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          background: "#3a5a40",
                          color: "#fff",
                          border: "none",
                          padding: "10px 18px",
                          borderRadius: "10px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          boxShadow: "0 4px 10px rgba(58, 90, 64, 0.3)",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = "#588157";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = "#3a5a40";
                          e.currentTarget.style.transform = "none";
                        }}
                      >
                        <Calendar size={18} /> Rent
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "none",
                    background: currentPage === 1 ? "#e9ecef" : "#a3b18a",
                    color: currentPage === 1 ? "#ced4da" : "#344e41",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <ChevronLeft size={20} />
                </button>

                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#3a5a40",
                  }}
                >
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "none",
                    background:
                      currentPage === totalPages ? "#e9ecef" : "#a3b18a",
                    color: currentPage === totalPages ? "#ced4da" : "#344e41",
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Rent Modal */}
      {isModalOpen && selectedBook && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              width: "90%",
              maxWidth: "450px",
              padding: "30px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#64748b",
              }}
            >
              <X size={24} />
            </button>

            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#3a5a40",
                marginBottom: "8px",
              }}
            >
              Rent Book
            </h2>
            <p
              style={{
                color: "#588157",
                marginBottom: "24px",
                fontSize: "15px",
              }}
            >
              You are renting <strong>{selectedBook.bookName}</strong>
            </p>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#344e41",
                  marginBottom: "8px",
                }}
              >
                How many days do you want to rent it?
              </label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={rentDays}
                  onChange={(e) => setRentDays(parseInt(e.target.value) || 1)}
                  style={{
                    width: "100px",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1px solid #ced4da",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
                <span style={{ color: "#64748b", fontSize: "15px" }}>days</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                background: "#f8f9fa",
                borderRadius: "12px",
                marginBottom: "24px",
              }}
            >
              <span style={{ color: "#344e41", fontWeight: "600" }}>
                Total Cost
              </span>
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: "800",
                  color: "#588157",
                }}
              >
                ₹{(selectedBook.price * rentDays).toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleRentConfirm}
              style={{
                width: "100%",
                padding: "14px",
                background: "#3a5a40",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.background = "#588157")}
              onMouseOut={(e) => (e.target.style.background = "#3a5a40")}
            >
              Confirm Rental
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
