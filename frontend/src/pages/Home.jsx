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
import { useNavigate, useParams } from "react-router-dom";

export default function Home() {
  const { categoryName } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);
  const [rentDays, setRentDays] = useState(7);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedInfoBook, setSelectedInfoBook] = useState(null);
  const [sortOption, setSortOption] = useState("name-asc");
  const booksPerPage = 10;
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("/api/books");
      setBooks(res.data || []);
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

      await axios.post("/api/borrow", formData);
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

  const filteredBooks = books.filter((b) => {
    const matchesSearch = b.bookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.bookCategory.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (categoryName) {
      return matchesSearch && b.bookCategory === decodeURIComponent(categoryName);
    }
    return matchesSearch;
  }).sort((a, b) => {
    if (sortOption === "name-asc") return a.bookName.localeCompare(b.bookName);
    if (sortOption === "name-desc") return b.bookName.localeCompare(a.bookName);
    if (sortOption === "price-asc") return parseFloat(a.price) - parseFloat(b.price);
    if (sortOption === "price-desc") return parseFloat(b.price) - parseFloat(a.price);
    return 0;
  });

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Get a specific image based on upload or return null if no cover
  const getCoverImage = (book) => {
    if (book.photoName && book.photoName !== "default.jpg" && book.photoName !== "") {
      if (book.photoName.startsWith("data:image")) return book.photoName;
      return `/books/${book.photoName}`;
    }
    return null;
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
            {categoryName ? decodeURIComponent(categoryName) : "Curated Knowledge Collection"}
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
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "30px",
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
              {searchQuery ? "Search Results" : (categoryName ? decodeURIComponent(categoryName) : "Trending Books")}
            </h2>
            <p style={{ color: "#588157" }}>
              {filteredBooks.length} books found
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "24px", marginRight: "20px" }}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", top: "50%", left: "12px", transform: "translateY(-50%)", color: "#6c757d" }}>
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Search table..."
                value={searchQuery}
                onChange={handleSearchChange}
                style={{
                  padding: "8px 16px 8px 36px",
                  borderRadius: "8px",
                  border: "1px solid #ced4da",
                  outline: "none",
                  fontSize: "14px",
                  width: "250px",
                  transition: "border-color 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "#a3b18a"}
                onBlur={(e) => e.target.style.borderColor = "#ced4da"}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#344e41" }}>Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #ced4da",
                  outline: "none",
                  fontSize: "14px",
                  color: "#495057",
                  cursor: "pointer",
                  background: "#fff"
                }}
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
            </div>
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
            <div className="smooth-scroll" style={{ overflowX: "auto", overflowY: "auto", maxHeight: "600px", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 15px rgba(52, 78, 65, 0.08)", border: "1px solid #eaeaea", marginBottom: "50px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #eaeaea", color: "#344e41", position: "sticky", top: 0, zIndex: 10 }}>
                    <th style={{ padding: "12px 16px", fontWeight: "600", fontSize: "14px" }}>S.No.</th>
                    <th style={{ padding: "12px 16px", fontWeight: "600", fontSize: "14px" }}>Book Name</th>
                    <th style={{ padding: "12px 16px", fontWeight: "600", fontSize: "14px" }}>Author</th>
                    <th style={{ padding: "12px 16px", fontWeight: "600", fontSize: "14px" }}>Category</th>
                    <th style={{ padding: "12px 16px", fontWeight: "600", fontSize: "14px" }}>Price/Day</th>
                    <th style={{ padding: "12px 16px", fontWeight: "600", fontSize: "14px" }}>Status</th>
                    <th style={{ padding: "12px 16px", fontWeight: "600", fontSize: "14px", whiteSpace: "nowrap" }}>Qty Left</th>
                    <th style={{ padding: "12px 16px", fontWeight: "600", fontSize: "14px", textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((b, index) => (
                    <tr className="table-row-animate" key={b.bookId} style={{ borderBottom: "1px solid #eaeaea", transition: "background 0.2s", animationDelay: `${index * 0.04}s` }} onMouseOver={(e) => e.currentTarget.style.background = "#f4f7f6"} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "12px 16px", color: "#666", fontSize: "14px", fontWeight: "500" }}>{index + 1}</td>
                      <td style={{ padding: "12px 16px", fontWeight: "600", color: "#333", fontSize: "15px" }}>{b.bookName}</td>
                      <td style={{ padding: "12px 16px", color: "#555", fontSize: "14px" }}>{b.author}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ padding: "4px 10px", background: "#e9ecef", borderRadius: "20px", fontSize: "12px", color: "#495057", fontWeight: "500", whiteSpace: "nowrap" }}>{b.bookCategory}</span>
                      </td>
                      <td style={{ padding: "12px 16px", fontWeight: "700", color: "#344e41", fontSize: "15px" }}>₹{parseFloat(b.price).toFixed(2)}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ 
                          color: (b.status === "Available" || b.status === "Active") ? "#588157" : "#ef4444", 
                          fontWeight: "500", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px"
                        }}>
                          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: (b.status === "Available" || b.status === "Active") ? "#588157" : "#ef4444" }}></div>
                          {(b.status === "Active" || b.status === "Available") ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#495057", fontSize: "14px", fontWeight: "500" }}>
                        {b.amountInStock} / {b.totalCopies}
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                          <button
                            onClick={() => { setSelectedInfoBook(b); setIsInfoModalOpen(true); }}
                            style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #344e41", background: "transparent", color: "#344e41", fontWeight: "600", cursor: "pointer", fontSize: "13px", transition: "all 0.2s", whiteSpace: "nowrap" }}
                            onMouseOver={(e) => { e.currentTarget.style.background = "#f4f7f6" }}
                            onMouseOut={(e) => { e.currentTarget.style.background = "transparent" }}
                          >
                            More Info
                          </button>
                          <button
                            onClick={() => openRentModal(b)}
                            style={{ display: "flex", alignItems: "center", gap: "6px", background: "#3a5a40", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "13px", transition: "all 0.2s", whiteSpace: "nowrap" }}
                            onMouseOver={(e) => e.currentTarget.style.background = "#588157"}
                            onMouseOut={(e) => e.currentTarget.style.background = "#3a5a40"}
                          >
                            <Calendar size={14} /> Rent
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        )}
      </div>

      {/* Rent Modal */}
      {isModalOpen && selectedBook && (
        <div
          className="modal-backdrop-animate"
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
            className="modal-content-animate"
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

      {/* Info Modal */}
      {isInfoModalOpen && selectedInfoBook && (
        <div
          className="modal-backdrop-animate"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(5px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setIsInfoModalOpen(false)}
        >
          <div
            className="modal-content-animate"
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "32px",
              width: "100%",
              maxWidth: "800px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              position: "relative",
              display: "flex",
              gap: "32px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsInfoModalOpen(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "rgba(0,0,0,0.05)",
                border: "none",
                cursor: "pointer",
                color: "#64748b",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.1)"}
              onMouseOut={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.05)"}
            >
              <X size={20} />
            </button>

            {/* Thumbnail Left */}
            <div style={{ flex: "0 0 300px", borderRadius: "12px", overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", background: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "450px" }}>
              {getCoverImage(selectedInfoBook) ? (
                <img 
                  src={getCoverImage(selectedInfoBook)} 
                  alt={selectedInfoBook.bookName} 
                  style={{ width: "100%", height: "450px", objectFit: "cover" }} 
                />
              ) : (
                <div style={{ padding: "40px", textAlign: "center", color: "#6c757d", fontSize: "15px", fontWeight: "500", border: "2px dashed #dee2e6", borderRadius: "8px", margin: "20px", width: "calc(100% - 40px)", display: "flex", alignItems: "center", justifyContent: "center", height: "410px" }}>
                  No cover page was added
                </div>
              )}
            </div>

            {/* Details Right */}
            <div style={{ flex: "1", display: "flex", flexDirection: "column" }}>
              <span style={{ 
                display: "inline-block", padding: "4px 12px", background: "#e9ecef", color: "#495057", 
                borderRadius: "20px", fontSize: "13px", fontWeight: "600", marginBottom: "12px", width: "fit-content"
              }}>
                {selectedInfoBook.bookCategory}
              </span>

              <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#344e41", marginBottom: "8px", lineHeight: "1.2" }}>
                {selectedInfoBook.bookName}
              </h2>
              
              <div style={{ fontSize: "16px", color: "#666", marginBottom: "24px" }}>
                By <strong style={{ color: "#333" }}>{selectedInfoBook.author}</strong>
              </div>

              <div style={{ background: "#f8f9fa", padding: "16px", borderRadius: "12px", marginBottom: "24px", border: "1px solid #eaeaea" }}>
                <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#344e41", marginBottom: "8px" }}>About this Book</h4>
                <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.6", margin: 0 }}>
                  This is a wonderful book in the <strong>{selectedInfoBook.bookCategory}</strong> genre written by <strong>{selectedInfoBook.author}</strong>. 
                  It offers great insights and knowledge, captivating readers from the very first page. 
                  Explore the fascinating concepts and immerse yourself in this incredible masterpiece.
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", borderTop: "1px solid #eaeaea", paddingTop: "24px" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "#588157", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Price / Day</div>
                  <div style={{ fontSize: "28px", fontWeight: "800", color: "#344e41" }}>₹{parseFloat(selectedInfoBook.price).toFixed(2)}</div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ 
                    color: (selectedInfoBook.status === "Available" || selectedInfoBook.status === "Active") ? "#588157" : "#ef4444", 
                    fontWeight: "600", display: "flex", alignItems: "center", gap: "6px", fontSize: "15px",
                    background: (selectedInfoBook.status === "Available" || selectedInfoBook.status === "Active") ? "rgba(88,129,87,0.1)" : "rgba(239,68,68,0.1)",
                    padding: "8px 16px", borderRadius: "20px"
                  }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: (selectedInfoBook.status === "Available" || selectedInfoBook.status === "Active") ? "#588157" : "#ef4444" }}></div>
                    {(selectedInfoBook.status === "Active" || selectedInfoBook.status === "Available") ? "Available" : "Unavailable"}
                  </span>
                  
                  <button
                    onClick={() => {
                      setIsInfoModalOpen(false);
                      openRentModal(selectedInfoBook);
                    }}
                    style={{
                      display: "flex", alignItems: "center", gap: "8px", background: "#3a5a40", color: "#fff",
                      border: "none", padding: "12px 24px", borderRadius: "10px", fontWeight: "600", cursor: "pointer",
                      fontSize: "15px", transition: "all 0.2s", boxShadow: "0 4px 10px rgba(58, 90, 64, 0.2)"
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = "#588157"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = "#3a5a40"; e.currentTarget.style.transform = "none"; }}
                  >
                    <Calendar size={18} /> Rent Now
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
