import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Ensure this is correctly imported
import { BiChevronUp, BiChevronDown } from "react-icons/bi"; // Install this package if not already done
import { API_URL } from "../../../API";

const MobileSidebar = ({ setHambergClicked }) => {
  const [mainObject, setMainObject] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null); // Track expanded category
  const [showAllCategories, setShowAllCategories] = useState(false); // Track "Show More" state

  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        // Fetch categories
        const { data: categories = [] } = await axios.get(
          `${API_URL}/content?type=category`
        );
        const tempMainObject = {};

        // Prepare requests for subcategories
        const requests = categories.map((category) =>
          axios.get(`${API_URL}/subcategory?category=${category.text}`)
        );

        // Fetch subcategories in parallel
        const subcategoriesResponses = await Promise.all(requests);

        // Map subcategories to their respective categories
        subcategoriesResponses.forEach((response, index) => {
          const categoryName = categories[index]?.text;
          const subcategories = response?.data || [];
          tempMainObject[categoryName] = subcategories;
        });

        // Update state
        setMainObject(tempMainObject);
      } catch (error) {
        console.error("Error fetching categories or subcategories:", error);
      }
    };

    fetchCategoriesAndSubcategories();
  }, []);

  const toggleCategory = (categoryName) => {
    setExpandedCategory((prev) =>
      prev === categoryName ? null : categoryName
    );
  };

  const handleShowMore = () => {
    setShowAllCategories(true);
  };

  const categoriesToDisplay = showAllCategories
    ? Object.entries(mainObject)
    : Object.entries(mainObject).slice(0, 10);

  return (
    <div className="w-full p-2 h-full overflow-y-scroll">
      {categoriesToDisplay.map(([categoryName, subcategories]) => (
        <div
          key={categoryName}
          className="  py-2 text-lg border-b-2 border-gray-400 w-11/12"
        >
          {/* Category Header */}
          {subcategories.length > 0 ? (
            // Dropdown for categories with subcategories
            <div className=" flex gap-3 items-center justify-between">
              <Link
                onClick={() => {
                  setHambergClicked(false);
                  setShowAllCategories(false);
                }}
                to={`/itempage?item=${categoryName}`}
                className="mobile-footer-header "
              >
                {categoryName}
              </Link>
              <button
                onClick={() => toggleCategory(categoryName)}
                className=" w-1/4 flex justify-end items-center"
              >
                {expandedCategory === categoryName ? (
                  <BiChevronUp className="text-2xl" />
                ) : (
                  <BiChevronDown className="text-2xl" />
                )}
              </button>
            </div>
          ) : (
            // Static link for categories without subcategories
            <Link
              onClick={() => {
                setHambergClicked(false);
                setShowAllCategories(false);
              }}
              to={`/itempage?item=${categoryName}`}
              className="mobile-footer-header "
            >
              {categoryName}
            </Link>
          )}

          {/* Subcategories */}
          {expandedCategory === categoryName && subcategories.length > 0 && (
            <div className=" text-sm mt-1 flex  gap-x-2 flex-wrap">
              {subcategories.map((subcategory, index) => (
                <Link
                  onClick={() => {
                    setHambergClicked(false);
                    setShowAllCategories(false);
                  }}
                  key={subcategory._id}
                  to={`/itempage?item=${categoryName}&sub=${subcategory.text}`}
                  className={`subtitle text-gray-900 text-sm my-1 w-fit py-0 pr-2 ${
                    subcategories.length > 1 &&
                    index !== subcategories.length - 1
                      ? "border-r border-gray-900 "
                      : ""
                  }`}
                >
                  {subcategory.text}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Show More Button */}
      {!showAllCategories && Object.entries(mainObject).length > 10 && (
        <button
          className="show-more-btn text-blue-600"
          onClick={handleShowMore}
        >
          Show More
        </button>
      )}
    </div>
  );
};

export default MobileSidebar;
