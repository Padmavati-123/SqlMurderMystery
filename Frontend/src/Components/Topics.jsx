import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useParams, useNavigate } from "react-router-dom";
// import { Card, CardContent } from "../Components/ui/card";
// import { Button } from "../Components/ui/button";

import axios from "axios";

function TopicsPage() {
    const [topics, setTopics] = useState([]);
  
    useEffect(() => {
      axios.get("http://localhost:8080/api/topics").then((res) => setTopics(res.data));
    }, []);
  
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <Link to={`/description/${topic.id}`} key={topic.id} className="block p-4 border rounded-lg shadow-md text-center hover:shadow-lg transition cursor-pointer">
          {topic.name}
        </Link>        
        ))}
      </div>
    );
  }
  
  export default TopicsPage;