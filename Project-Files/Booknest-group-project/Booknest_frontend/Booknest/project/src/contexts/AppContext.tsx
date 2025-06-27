import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  price: number;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  isbn: string;
  publishedYear: number;
  pages: number;
  publisher: string;
  language: string;
  inStock: boolean;
  featured: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
}

interface CartItem {
  book: Book;
  quantity: number;
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  shippingAddress: string;
  paymentMethod: string;
}

interface AppState {
  user: User | null;
  books: Book[];
  cart: CartItem[];
  orders: Order[];
  users: User[];
  wishlist: string[];
  isLoading: boolean;
  darkMode: boolean;
}

type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_BOOKS'; payload: Book[] }
  | { type: 'ADD_TO_CART'; payload: Book }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { bookId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: Order['status'] } }
  | { type: 'ADD_TO_WISHLIST'; payload: string }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_WISHLIST'; payload: string[] }
  | { type: 'SET_ORDERS'; payload: Order[] };

const initialState: AppState = {
  user: null,
  books: [],
  cart: [],
  orders: [],
  users: [],
  wishlist: [],
  isLoading: false,
  darkMode: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_BOOKS':
      return { ...state, books: action.payload };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.book.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.book.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return { ...state, cart: [...state.cart, { book: action.payload, quantity: 1 }] };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.book.id !== action.payload) };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.book.id === action.payload.bookId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload] };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        )
      };
    case 'ADD_TO_WISHLIST':
      return { ...state, wishlist: [...state.wishlist, action.payload] };
    case 'REMOVE_FROM_WISHLIST':
      return { ...state, wishlist: state.wishlist.filter(id => id !== action.payload) };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        ),
        user: state.user?.id === action.payload.id ? action.payload : state.user
      };
    case 'SET_WISHLIST':
      return { ...state, wishlist: action.payload };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
  updateCartQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  createOrder: (shippingAddress: string, paymentMethod: string) => Promise<string>;
  addToWishlist: (bookId: string) => Promise<void>;
  removeFromWishlist: (bookId: string) => Promise<void>;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const API_URL = 'http://localhost:5000/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize data on mount
  useEffect(() => {
    initializeData();
    loadPersistedData();
  }, []);

  // Persist data when it changes
  useEffect(() => {
    localStorage.setItem('booknest_user', JSON.stringify(state.user));
    localStorage.setItem('booknest_cart', JSON.stringify(state.cart));
    localStorage.setItem('booknest_wishlist', JSON.stringify(state.wishlist));
    localStorage.setItem('booknest_darkmode', JSON.stringify(state.darkMode));
  }, [state.user, state.cart, state.wishlist, state.darkMode]);

  const loadPersistedData = () => {
    try {
      const savedUser = localStorage.getItem('booknest_user');
      const savedCart = localStorage.getItem('booknest_cart');
      const savedWishlist = localStorage.getItem('booknest_wishlist');
      const savedDarkMode = localStorage.getItem('booknest_darkmode');

      if (savedUser) {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'SET_USER', payload: user });
      }

      if (savedCart) {
        const cart = JSON.parse(savedCart);
        cart.forEach((item: CartItem) => {
          dispatch({ type: 'ADD_TO_CART', payload: item.book });
          if (item.quantity > 1) {
            dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { bookId: item.book.id, quantity: item.quantity } });
          }
        });
      }

      if (savedWishlist) {
        const wishlist = JSON.parse(savedWishlist);
        wishlist.forEach((bookId: string) => {
          dispatch({ type: 'ADD_TO_WISHLIST', payload: bookId });
        });
      }

      if (savedDarkMode) {
        const darkMode = JSON.parse(savedDarkMode);
        if (darkMode) {
          dispatch({ type: 'TOGGLE_DARK_MODE' });
        }
      }
    } catch (error) {
      console.error('Error loading persisted data:', error);
    }
  };

  const initializeData = () => {
    // Initialize books data with proper image URLs
    const booksData: Book[] = [
      {
        id: '1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Classic Literature',
        price: 12.99,
        description: 'A classic American novel set in the summer of 1922, exploring themes of decadence, idealism, and the American Dream.',
        image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
        rating: 4.2,
        reviews: 2547,
        isbn: '978-0-7432-7356-5',
        publishedYear: 1925,
        pages: 180,
        publisher: 'Scribner',
        language: 'English',
        inStock: true,
        featured: true
      },
      {
        id: '2',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Classic Literature',
        price: 14.99,
        description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
        image: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
        rating: 4.3,
        reviews: 3891,
        isbn: '978-0-06-112008-4',
        publishedYear: 1960,
        pages: 376,
        publisher: 'Harper Perennial',
        language: 'English',
        inStock: true,
        featured: true
      },
      {
        id: '3',
        title: '1984',
        author: 'George Orwell',
        genre: 'Dystopian Fiction',
        price: 13.99,
        description: 'A dystopian social science fiction novel exploring themes of totalitarianism and surveillance.',
        image: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
        rating: 4.4,
        reviews: 4567,
        isbn: '978-0-452-28423-4',
        publishedYear: 1949,
        pages: 328,
        publisher: 'Signet Classics',
        language: 'English',
        inStock: true,
        featured: true
      },
      {
        id: '4',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        genre: 'Romance',
        price: 11.99,
        description: 'A romantic novel that follows the character development of Elizabeth Bennet.',
        image: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
        rating: 4.3,
        reviews: 2876,
        isbn: '978-0-14-143951-8',
        publishedYear: 1813,
        pages: 432,
        publisher: 'Penguin Classics',
        language: 'English',
        inStock: true,
        featured: false
      },
      {
        id: '5',
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        genre: 'Coming of Age',
        price: 13.50,
        description: 'A controversial novel about teenage rebellion and alienation.',
        image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
        rating: 3.8,
        reviews: 2134,
        isbn: '978-0-316-76948-0',
        publishedYear: 1951,
        pages: 277,
        publisher: 'Little, Brown and Company',
        language: 'English',
        inStock: true,
        featured: false
      },
      {
        id: '6',
        title: 'Harry Potter and the Philosopher\'s Stone',
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        price: 15.99,
        description: 'The first book in the magical Harry Potter series.',
        image: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
        rating: 4.7,
        reviews: 8934,
        isbn: '978-0-439-70818-8',
        publishedYear: 1997,
        pages: 309,
        publisher: 'Scholastic',
        language: 'English',
        inStock: true,
        featured: true
      },
      {
        id: '7',
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        genre: 'Fantasy',
        price: 24.99,
        description: 'An epic high fantasy novel following the quest to destroy the One Ring.',
        image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
        rating: 4.5,
        reviews: 5672,
        isbn: '978-0-544-00341-5',
        publishedYear: 1954,
        pages: 1216,
        publisher: 'Houghton Mifflin',
        language: 'English',
        inStock: true,
        featured: true
      },
      {
        id: '8',
        title: 'Dune',
        author: 'Frank Herbert',
        genre: 'Science Fiction',
        price: 16.99,
        description: 'A science fiction masterpiece set on the desert planet Arrakis.',
        image: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
        rating: 4.2,
        reviews: 3456,
        isbn: '978-0-441-17271-9',
        publishedYear: 1965,
        pages: 688,
        publisher: 'Ace',
        language: 'English',
        inStock: true,
        featured: false
      },
      {
        id: '9',
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        genre: 'Fantasy',
        price: 14.99,
        description: 'A fantasy adventure novel about Bilbo Baggins and his unexpected journey.',
        image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
        rating: 4.3,
        reviews: 4123,
        isbn: '978-0-547-92822-7',
        publishedYear: 1937,
        pages: 366,
        publisher: 'Houghton Mifflin',
        language: 'English',
        inStock: true,
        featured: false
      },
      {
        id: '10',
        title: 'The Da Vinci Code',
        author: 'Dan Brown',
        genre: 'Thriller',
        price: 15.99,
        description: 'A mystery thriller novel involving religious conspiracy theories.',
        image: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
        rating: 3.9,
        reviews: 2987,
        isbn: '978-0-307-27424-5',
        publishedYear: 2003,
        pages: 489,
        publisher: 'Doubleday',
        language: 'English',
        inStock: true,
        featured: false
      },
      {
        id: '11',
        title: 'Gone Girl',
        author: 'Gillian Flynn',
        genre: 'Psychological Thriller',
        price: 16.99,
        description: 'A psychological thriller about a marriage gone terribly wrong.',
        image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
        rating: 4.0,
        reviews: 3567,
        isbn: '978-0-307-58836-4',
        publishedYear: 2012,
        pages: 432,
        publisher: 'Crown Publishers',
        language: 'English',
        inStock: true,
        featured: false
      },
      {
        id: '12',
        title: 'The Girl with the Dragon Tattoo',
        author: 'Stieg Larsson',
        genre: 'Crime Thriller',
        price: 14.99,
        description: 'A crime thriller featuring journalist Mikael Blomkvist and hacker Lisbeth Salander.',
        image: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
        rating: 4.1,
        reviews: 4234,
        isbn: '978-0-307-45454-1',
        publishedYear: 2005,
        pages: 672,
        publisher: 'Vintage Crime',
        language: 'English',
        inStock: true,
        featured: false
      },
      {
        id: '13',
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        genre: 'Philosophical Fiction',
        price: 13.99,
        description: 'A philosophical novel about following your dreams and finding your destiny.',
        image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
        rating: 3.9,
        reviews: 2876,
        isbn: '978-0-06-231500-7',
        publishedYear: 1988,
        pages: 163,
        publisher: 'HarperOne',
        language: 'English',
        inStock: true,
        featured: true
      },
      {
        id: '14',
        title: 'The Kite Runner',
        author: 'Khaled Hosseini',
        genre: 'Historical Fiction',
        price: 15.99,
        description: 'A powerful story of friendship and redemption set in Afghanistan.',
        image: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
        rating: 4.3,
        reviews: 3654,
        isbn: '978-1-59448-000-3',
        publishedYear: 2003,
        pages: 371,
        publisher: 'Riverhead Books',
        language: 'English',
        inStock: true,
        featured: false
      },
      {
        id: '15',
        title: 'Life of Pi',
        author: 'Yann Martel',
        genre: 'Adventure Fiction',
        price: 14.99,
        description: 'A survival story about a boy stranded on a lifeboat with a Bengal tiger.',
        image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
        rating: 3.9,
        reviews: 2987,
        isbn: '978-0-15-602732-3',
        publishedYear: 2001,
        pages: 319,
        publisher: 'Harcourt',
        language: 'English',
        inStock: true,
        featured: false
      },
      {
        id: '16',
        title: 'The Book Thief',
        author: 'Markus Zusak',
        genre: 'Historical Fiction',
        price: 16.99,
        description: 'A story about a young girl living in Nazi Germany who steals books.',
        image: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
        rating: 4.4,
        reviews: 4567,
        isbn: '978-0-375-84220-7',
        publishedYear: 2005,
        pages: 552,
        publisher: 'Knopf Books for Young Readers',
        language: 'English',
        inStock: true,
        featured: true
      },
      {
        id: '17',
        title: 'The Hunger Games',
        author: 'Suzanne Collins',
        genre: 'Dystopian Fiction',
        price: 13.99,
        description: 'A dystopian novel about a televised fight to the death.',
        image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
        rating: 4.3,
        reviews: 5678,
        isbn: '978-0-439-02348-1',
        publishedYear: 2008,
        pages: 374,
        publisher: 'Scholastic Press',
        language: 'English',
        inStock: true,
        featured: false
      },
      {
        id: '18',
        title: 'Fifty Shades of Grey',
        author: 'E.L. James',
        genre: 'Erotic Romance',
        price: 15.99,
        description: 'An erotic romance novel exploring a complex relationship.',
        image: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
        rating: 3.7,
        reviews: 1876,
        isbn: '978-0-345-80349-5',
        publishedYear: 2011,
        pages: 514,
        publisher: 'Vintage Books',
        language: 'English',
        inStock: true,
        featured: false
      },
      {
        id: '19',
        title: 'The Fault in Our Stars',
        author: 'John Green',
        genre: 'Young Adult',
        price: 12.99,
        description: 'A touching love story between two teenagers with cancer.',
        image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
        rating: 4.2,
        reviews: 3456,
        isbn: '978-0-525-47881-2',
        publishedYear: 2012,
        pages: 313,
        publisher: 'Dutton Books',
        language: 'English',
        inStock: true,
        featured: false
      },
      {
        id: '20',
        title: 'Where the Crawdads Sing',
        author: 'Delia Owens',
        genre: 'Mystery',
        price: 17.99,
        description: 'A mystery novel about a girl who raised herself in the marshes of North Carolina.',
        image: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
        rating: 4.5,
        reviews: 4789,
        isbn: '978-0-7352-1909-0',
        publishedYear: 2018,
        pages: 384,
        publisher: 'G.P. Putnam\'s Sons',
        language: 'English',
        inStock: true,
        featured: true
      },
      {
        id: '21',
        title: 'Educated',
        author: 'Tara Westover',
        genre: 'Memoir',
        price: 16.99,
        description: 'A memoir about education, family, and the struggle for self-invention.',
        image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
        rating: 4.6,
        reviews: 3987,
        isbn: '978-0-399-59050-4',
        publishedYear: 2018,
        pages: 334,
        publisher: 'Random House',
        language: 'English',
        inStock: true,
        featured: true
      },
      {
        id: '22',
        title: 'Becoming',
        author: 'Michelle Obama',
        genre: 'Biography',
        price: 18.99,
        description: 'The intimate memoir of former First Lady Michelle Obama.',
        image: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
        rating: 4.7,
        reviews: 5234,
        isbn: '978-1-5247-6313-8',
        publishedYear: 2018,
        pages: 448,
        publisher: 'Crown',
        language: 'English',
        inStock: true,
        featured: true
      }
    ];

    dispatch({ type: 'SET_BOOKS', payload: booksData });

    // Initialize sample users
    const usersData: User[] = [
      {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@booknest.com',
        role: 'admin',
        joinDate: '2024-01-15',
        totalOrders: 0,
        totalSpent: 0
      },
      {
        id: 'user-1',
        name: 'Demo User',
        email: 'user@example.com',
        role: 'user',
        joinDate: '2024-02-20',
        totalOrders: 5,
        totalSpent: 124.95
      }
    ];

    dispatch({ type: 'SET_USERS', payload: usersData });
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      localStorage.setItem('token', data.token);
      dispatch({ type: 'SET_USER', payload: data.user });
      await fetchOrders();
      // Fetch wishlist
      const wishlistRes = await fetch(`${API_URL}/user/wishlist`, {
        headers: getAuthHeaders(),
      });
      if (wishlistRes.ok) {
        const wishlist = await wishlistRes.json();
        dispatch({ type: 'SET_WISHLIST', payload: wishlist.map((b: any) => b._id || b) });
      }
      return true;
    } catch {
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) return false;
      // Optionally, auto-login after signup:
      return await login(email, password);
    } catch {
      return false;
    }
  };

  const logout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'CLEAR_CART' });
    dispatch({ type: 'SET_ORDERS', payload: [] });
    localStorage.removeItem('booknest_user');
    localStorage.removeItem('booknest_cart');
  };

  const addToCart = (book: Book) => {
    dispatch({ type: 'ADD_TO_CART', payload: book });
  };

  const removeFromCart = (bookId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: bookId });
  };

  const updateCartQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
    } else {
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { bookId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const createOrder = async (shippingAddress: string, paymentMethod: string): Promise<string> => {
    if (!state.user || state.cart.length === 0) {
      throw new Error('Invalid order data');
    }

    const orderId = 'order-' + Date.now();
    const order: Order = {
      id: orderId,
      userId: state.user.id,
      userName: state.user.name,
      userEmail: state.user.email,
      items: [...state.cart],
      total: getCartTotal(),
      status: 'pending',
      orderDate: new Date().toISOString().split('T')[0],
      shippingAddress,
      paymentMethod
    };

    dispatch({ type: 'ADD_ORDER', payload: order });
    dispatch({ type: 'CLEAR_CART' });

    return orderId;
  };

  const addToWishlist = async (bookId: string) => {
    if (!state.user) return;
    try {
      const res = await fetch(`${API_URL}/user/wishlist`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ bookId }),
      });
      if (res.ok) {
        const wishlist = await res.json();
        dispatch({ type: 'SET_WISHLIST', payload: wishlist.map((b: any) => b._id || b) });
      }
    } catch {}
  };

  const removeFromWishlist = async (bookId: string) => {
    await addToWishlist(bookId); // toggle logic on backend
  };

  const getCartTotal = (): number => {
    return state.cart.reduce((total, item) => total + (item.book.price * item.quantity), 0);
  };

  const getCartItemsCount = (): number => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  };

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch(`${API_URL}/orders/my`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const orders = await res.json();
      dispatch({ type: 'SET_ORDERS', payload: orders });
    }
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    login,
    signup,
    logout,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    createOrder,
    addToWishlist,
    removeFromWishlist,
    getCartTotal,
    getCartItemsCount,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}