import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      <section className="hero bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">🌱 Welcome to Herizon</h1>
          <p className="text-xl mb-8">Explore STEAM, Create the Future</p>
          <Link to="/lessons" className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">Start Exploring</Link>
        </div>
      </section>
      <section className="categories py-16 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">STEAM Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Link to="/lessons" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center">
              <div className="text-4xl mb-2">🤖</div>
              <h3 className="font-semibold">Artificial Intelligence</h3>
            </Link>
            <Link to="/lessons" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center">
              <div className="text-4xl mb-2">⚙️</div>
              <h3 className="font-semibold">Robotics</h3>
            </Link>
            <Link to="/lessons" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center">
              <div className="text-4xl mb-2">🌍</div>
              <h3 className="font-semibold">Environmental Science</h3>
            </Link>
            <Link to="/lessons" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center">
              <div className="text-4xl mb-2">🔧</div>
              <h3 className="font-semibold">Engineering</h3>
            </Link>
            <Link to="/lessons" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center">
              <div className="text-4xl mb-2">🎨</div>
              <h3 className="font-semibold">Creative Technology</h3>
            </Link>
          </div>
        </div>
      </section>
      <section className="challenges py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🌉</div>
              <h3 className="text-xl font-semibold mb-2">Paper Bridge Challenge</h3>
              <p className="mb-4">Build a bridge from paper and test its strength.</p>
              <Link to="/challenges" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Start Challenge</Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">💧</div>
              <h3 className="text-xl font-semibold mb-2">Filter Dirty Water</h3>
              <p className="mb-4">Clean water using simple materials and science.</p>
              <Link to="/challenges" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Start Challenge</Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">Build a Mini Robot</h3>
              <p className="mb-4">Construct a simple robot using basic components.</p>
              <Link to="/challenges" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Start Challenge</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;