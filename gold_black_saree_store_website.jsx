import { useState, useEffect } from "react";

// 🌐 Cloud Backend API
const API_URL = "https://your-api-url.com";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SareeStore() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", price: "", img: "" });

  const upiId = "7997512340@axi";

  const loginAdmin = () => {
    if (adminPass === "royal123") setIsAdmin(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setForm({ ...form, img: url });
    }
  };

  const addProduct = async () => {
    const newProduct = { ...form, price: Number(form.price), id: Date.now() };

    await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });

    setProducts([...products, newProduct]);
    setForm({ name: "", price: "", img: "" });
  };

  const addToCart = (p) => {
    setCart([...cart, p]);
    setShowCart(true);
  };
  const total = cart.reduce((s, i) => s + i.price, 0);

  const orderId = "ZAQE" + Date.now();

  const saveOrder = async () => {
    const orderData = { orderId, customer, cart, total };

    await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
  };

  const upiLink = `upi://pay?pa=${upiId}&pn=zaqe&am=${total}&cu=INR`;

  useEffect(() => {
    fetch(`${API_URL}/products`).then(res => res.json()).then(setProducts);
  }, []);

  return (
    <div className="bg-gradient-to-b from-black via-zinc-950 to-black text-white min-h-screen p-6 font-serif">

      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold tracking-[0.35em] text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-700 drop-shadow-lg">
          ZAQE
        </h1>
        <p className="text-gray-400 mt-3 italic text-lg">Where Elegance Drapes You</p>
      </div>

      {/* Luxury Navbar */}
      <div className="flex justify-between items-center mb-8 border-b border-yellow-700 pb-4">
        <span className="text-xl tracking-widest text-yellow-500 font-semibold">FLAGSHIP COLLECTION</span>
        <span className="text-sm text-gray-400">Free Shipping Across India</span>
      </div>

      {/* Hero Banner */}
      <div className="relative h-[60vh] rounded-3xl overflow-hidden mb-12">
        <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
          <h2 className="text-5xl text-yellow-500 font-bold mb-4">The Grand Festive Edit</h2>
          <p className="text-gray-300 mb-6">Drape Yourself in Royal Elegance</p>
          <Button className="bg-yellow-500 text-black px-8 py-3 text-lg">Shop Now</Button>
        </div>
      </div>

      {/* Hidden Admin Login */}
      {!isAdmin && (
        <div className="text-center mb-6">
          <Input
            type="password"
            placeholder="Admin Password"
            className="text-black max-w-xs mx-auto"
            onChange={(e) => setAdminPass(e.target.value)}
          />
          <Button onClick={loginAdmin} className="mt-2 bg-yellow-500 text-black">Login as Admin</Button>
        </div>
      )}

      {/* Admin Panel */}
      {isAdmin && (
        <div className="grid md:grid-cols-3 gap-3 my-6">
          <Input placeholder="Product Name" className="text-black" onChange={(e)=>setForm({...form,name:e.target.value})} />
          <Input placeholder="Price" className="text-black" onChange={(e)=>setForm({...form,price:e.target.value})} />
          <Input type="file" accept="image/*" className="text-black" onChange={handleImageUpload} />
          <Button onClick={addProduct} className="bg-yellow-500 text-black">Add Product</Button>
        </div>
      )}

      {/* Search */}
      <div className="mb-8 text-center">
        <Input
          placeholder="Search sarees..."
          className="text-black max-w-md mx-auto"
          onChange={(e)=>setSearch(e.target.value)}
        />
      </div>

      {/* Products */}
      <div className="grid md:grid-cols-3 gap-8">
        {products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())).map(p => (
          <motion.div key={p.id} whileHover={{ scale: 1.05 }}>
            <Card className="bg-gradient-to-b from-zinc-900 to-black border border-yellow-600/60 rounded-2xl overflow-hidden shadow-lg hover:shadow-yellow-600/30 transition-all duration-500">
              <img src={p.img} className="h-72 w-full object-cover" />
              <CardContent>
                <h2 className="text-yellow-500 text-xl">{p.name}</h2>
                <p>₹{p.price}</p>
                <Button onClick={()=>addToCart(p)} className="w-full mt-2 bg-yellow-500 text-black">Add to Cart</Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed top-0 right-0 w-full md:w-96 h-full bg-black border-l border-yellow-600 p-6 z-50 overflow-y-auto">
          <h2 className="text-2xl text-yellow-500 mb-4">Your Cart</h2>
          {cart.map((item,i)=>(<p key={i}>{item.name} – ₹{item.price}</p>))}
          <h3 className="mt-4">Total: ₹{total}</h3>

          <Input placeholder="Name" className="text-black mt-3" onChange={(e)=>setCustomer({...customer,name:e.target.value})}/>
          <Input placeholder="Phone" className="text-black mt-2" onChange={(e)=>setCustomer({...customer,phone:e.target.value})}/>
          <Input placeholder="Address" className="text-black mt-2" onChange={(e)=>setCustomer({...customer,address:e.target.value})}/>

          <a href={`upi://pay?pa=${upiId}&pn=zaqe&am=${total}&cu=INR`}>
            <Button className="bg-yellow-500 text-black mt-4 w-full">Pay via UPI</Button>
          </a>

          <a
            href={`https://wa.me/917997512340?text=Order%20ID:%20${orderId}%0AName:%20${customer.name}%0APhone:%20${customer.phone}%0AAddress:%20${customer.address}%0ATotal:%20₹${total}`}
            onClick={saveOrder}
            target="_blank"
          >
            <Button className="mt-2 w-full border border-yellow-500 text-yellow-500">Order on WhatsApp</Button>
          </a>

          <Button onClick={()=>setShowCart(false)} className="mt-3 w-full">Close</Button>
        </div>
      )}

      {/* Cart */}
      <div className="mt-10 text-center border-t border-yellow-600 pt-6">
        <h2 className="text-2xl text-yellow-500">Total: ₹{total}</h2>
        <a href={upiLink}>
          <Button className="bg-yellow-500 text-black mt-3">Pay via UPI</Button>
        </a>
      </div>

      {/* Reviews Section */}
      <div className="mt-20 text-center">
        <h3 className="text-3xl text-yellow-500 mb-6 tracking-widest">Client Diaries</h3>
        <p className="text-gray-400 max-w-2xl mx-auto italic">
          “ZAQE made my wedding look royal. The saree quality & packaging felt truly couture.” – Ananya R.
        </p>
      </div>

      {/* Instagram Lookbook */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
        <img src="https://images.unsplash.com/photo-1593032465175-481ac7f401a0" className="rounded-xl object-cover h-48 w-full" />
        <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c" className="rounded-xl object-cover h-48 w-full" />
        <img src="https://images.unsplash.com/photo-1583391733956-6c78276477e2" className="rounded-xl object-cover h-48 w-full" />
        <img src="https://images.unsplash.com/photo-1602810319428-019690571b5b" className="rounded-xl object-cover h-48 w-full" />
      </div>

      {/* Luxury Footer */}
      <div className="mt-20 border-t border-yellow-700 pt-10 text-center text-gray-400">
        <h4 className="text-yellow-500 text-2xl mb-2 tracking-[0.3em]">ZAQE</h4>
        <p className="italic mb-3">Crafted for Timeless Elegance</p>
        <p className="text-sm">© 2026 ZAQE. All Rights Reserved.</p>
      </div>

      {/* Floating WhatsApp */}
      <a href="https://wa.me/917997512340" target="_blank" className="fixed bottom-6 right-6 bg-yellow-500 text-black px-5 py-3 rounded-full shadow-xl hover:scale-110 transition-all duration-300 font-semibold">
        WhatsApp Order
      </a>

    </div>
  );
}
