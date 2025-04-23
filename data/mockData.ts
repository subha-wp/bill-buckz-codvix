export const mockInvoices = [
  {
    id: '1',
    merchant: 'SuperMart Grocery',
    date: 'Today, 2:30 PM',
    amount: '1,250.00',
    cashbackAmount: '62.50',
    cashbackStatus: 'Pending',
    image: 'https://images.pexels.com/photos/4127636/pexels-photo-4127636.jpeg'
  },
  {
    id: '2',
    merchant: 'Tech Galaxy',
    date: 'Yesterday, 5:45 PM',
    amount: '3,499.00',
    cashbackAmount: '175.00',
    cashbackStatus: 'Credited',
    image: 'https://images.pexels.com/photos/3715275/pexels-photo-3715275.jpeg'
  },
  {
    id: '3',
    merchant: 'Fashion World',
    date: '23 Apr, 11:20 AM',
    amount: '899.00',
    cashbackAmount: '45.00',
    cashbackStatus: 'Credited',
    image: 'https://images.pexels.com/photos/1564149/pexels-photo-1564149.jpeg'
  },
  {
    id: '4',
    merchant: 'Cafe Coffee',
    date: '21 Apr, 3:15 PM',
    amount: '235.00',
    cashbackAmount: '12.00',
    cashbackStatus: 'Credited',
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'
  },
  {
    id: '5',
    merchant: 'Daily Essentials',
    date: '18 Apr, 10:30 AM',
    amount: '560.00',
    cashbackAmount: '28.00',
    cashbackStatus: 'Credited',
    image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg'
  }
];

export const mockCashbacks = [
  {
    id: '1',
    title: 'Cashback for SuperMart',
    date: 'Today, 3:30 PM',
    amount: '62.50',
    type: 'credited',
    status: 'completed'
  },
  {
    id: '2',
    title: 'Cashback for Tech Galaxy',
    date: 'Yesterday, 6:45 PM',
    amount: '175.00',
    type: 'credited',
    status: 'completed'
  },
  {
    id: '3',
    title: 'Withdrawal to UPI',
    date: '24 Apr, 12:20 PM',
    amount: '500.00',
    type: 'withdrawn',
    status: 'completed'
  },
  {
    id: '4',
    title: 'Cashback for Fashion World',
    date: '23 Apr, 12:20 PM',
    amount: '45.00',
    type: 'credited',
    status: 'completed'
  },
  {
    id: '5',
    title: 'Withdrawal to UPI',
    date: '22 Apr, 4:15 PM',
    amount: '1,000.00',
    type: 'withdrawn',
    status: 'completed'
  }
];

export const mockWithdrawals = [
  {
    id: '1',
    amount: '500.00',
    date: '24 Apr, 2025',
    time: '12:20 PM',
    status: 'Completed',
    upiId: 'alex@okicici'
  },
  {
    id: '2',
    amount: '1,000.00',
    date: '22 Apr, 2025',
    time: '4:15 PM',
    status: 'Completed',
    upiId: 'alex@okicici'
  },
  {
    id: '3',
    amount: '250.00',
    date: '18 Apr, 2025',
    time: '2:45 PM',
    status: 'Processing',
    upiId: 'alex@okicici'
  },
  {
    id: '4',
    amount: '100.00',
    date: '15 Apr, 2025',
    time: '10:30 AM',
    status: 'Failed',
    upiId: 'alex@ybl'
  },
  {
    id: '5',
    amount: '750.00',
    date: '10 Apr, 2025',
    time: '1:35 PM',
    status: 'Completed',
    upiId: 'alex@ybl'
  }
];

export const mockMerchants = [
  {
    id: '1',
    name: 'SuperMart Grocery',
    category: 'Grocery',
    rating: '4.8',
    distance: '0.5 km',
    image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg',
    latitude: 12.9716,
    longitude: 77.5946
  },
  {
    id: '2',
    name: 'Tech Galaxy',
    category: 'Electronics',
    rating: '4.6',
    distance: '1.2 km',
    image: 'https://images.pexels.com/photos/3715275/pexels-photo-3715275.jpeg',
    latitude: 12.9746,
    longitude: 77.6046
  },
  {
    id: '3',
    name: 'Fashion World',
    category: 'Fashion',
    rating: '4.3',
    distance: '0.8 km',
    image: 'https://images.pexels.com/photos/1564149/pexels-photo-1564149.jpeg',
    latitude: 12.9696,
    longitude: 77.5846
  },
  {
    id: '4',
    name: 'Cafe Coffee',
    category: 'Restaurant',
    rating: '4.5',
    distance: '0.3 km',
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
    latitude: 12.9756,
    longitude: 77.5976
  },
  {
    id: '5',
    name: 'Daily Essentials',
    category: 'Grocery',
    rating: '4.2',
    distance: '1.5 km',
    image: 'https://images.pexels.com/photos/3962285/pexels-photo-3962285.jpeg',
    latitude: 12.9636,
    longitude: 77.6076
  }
];