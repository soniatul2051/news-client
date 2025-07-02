import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";

import "./style/index.css";
import { API_URL } from "../../../API";

const MobileFooter = () => {
  const [mainObject, setMainObject] = useState({});

  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        // Fetch categories
        const response = await axios.get(`${API_URL}/content?type=category`);
        const categories = response?.data || [];

        // Fetch all subcategories in parallel
        const requests = categories.map((category) =>
          axios.get(`${API_URL}/subcategory?category=${category.text}`)
        );

        const subcategoriesResponses = await Promise.all(requests);

        // Map categories to their respective subcategories
        const tempMainObject = categories.reduce((acc, category, index) => {
          const subcategories = subcategoriesResponses[index]?.data || [];
          acc[category.text] = subcategories;
          return acc;
        }, {});

        setMainObject(tempMainObject);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCategoriesAndSubcategories();
  }, [API_URL]);

  // console.log("main object in mobile footer  : ", mainObject);

  return (
    <div className="accordin-main-container-area">
      {Object.entries(mainObject).map(([categoryName, subcategories]) => (
        <div key={categoryName} className=" py-2 border-b">
          {/* Category Header */}
          <div className=" flex justify-between items-center ">
            <Link to={`/itempage?item=${categoryName}`}>
              <div className="footer-heading text-lg flex gap-1 justify-start items-center">
                <span>{categoryName}</span>
                <HiOutlineChevronDoubleRight className="text-lg" />
              </div>
            </Link>
          </div>

          {/* Subcategories */}
          <div className="footer-items pl-2 flex gap-2">
            {subcategories.map((subcategory, index) => (
              <Link
                key={index}
                to={`/itempage?item=${categoryName}&sub=${subcategory.text}`}
                className="atag "
              >
                <div
                  className={`subtitle  text-sm text-gray-400 my-1 w-fit py-0 pr-3 ${
                    subcategories.length > 1 &&
                    index !== subcategories.length - 1
                      ? "border-r"
                      : ""
                  }`}
                >
                  {subcategory.text}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MobileFooter;
