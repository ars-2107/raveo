import React from "react";
import { Route, Routes, useParams } from "react-router-dom";
import Protected from "../components/Protected/Protected";
import Home from "../pages/Home/Home";
import SearchResults from "../pages/Search/SearchResults";
import Explore from "../pages/Explore/Explore";
import Reviews from "../pages/Reviews/Reviews";
import Details from "../pages/Details/Details";
import ReviewList from "../pages/ReviewList/ReviewList";
import PasswordUpdate from "../pages/PasswordUpdate/PasswordUpdate";
import Person from "../pages/Person/Person";
import Error from "../pages/Error/Error";
import Help from "../pages/QuickLinks/Help";
import About from "../pages/QuickLinks/About";
import TermsOfUse from "../pages/QuickLinks/TermsOfUse";
import PrivacyPolicy from "../pages/QuickLinks/PrivacyPolicy";
import OtherApps from "../pages/QuickLinks/OtherApps";

const DetailsRoute = () => {
  const { category, id } = useParams();
  
  const categories = ["tv", "movie"];
  
  return categories.includes(category) ? <Details id={id} /> : <Person category={category} id={id} />;
};

const CustomRoutes = () => {
  return (
    <Routes>
      <Route path="/" Component={Home} />
      <Route path="/results" Component={SearchResults} />
      <Route path="/explore/all" element={<Explore mediaType="all" />} />
      <Route path="/explore/movie" element={<Explore mediaType="movie" />} />
      <Route path="/explore/tv" element={<Explore mediaType="tv" />} />
      <Route path="/reviews" Component={Reviews} />
      <Route path="/:category/:id" element={<DetailsRoute />} />
      <Route path="/my-reviews" element={<Protected><ReviewList /></Protected>} />
      <Route path="/password-update" element={<Protected><PasswordUpdate /></Protected>} />
      <Route path="/help" Component={Help} />
      <Route path="/about" Component={About} />
      <Route path="/terms-of-use" Component={TermsOfUse} />
      <Route path="/privacy-policy" Component={PrivacyPolicy} />
      <Route path="/other-apps" Component={OtherApps} />
      <Route path="*" Component={Error} /> 
    </Routes>
  );
};

export default CustomRoutes;