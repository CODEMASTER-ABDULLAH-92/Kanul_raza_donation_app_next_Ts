"use client";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiDollarSign,
  FiBook,
  FiHome,
  FiSend,
  FiX,
  FiClock,
  FiFileText,
  FiAlertCircle,
  FiGift,
  FiStar,
  FiPackage,
} from "react-icons/fi";

// fa (v4 compatible) icons that exist in react-icons/fa
import {
  FaSchool,
  FaBook,
  FaBuilding,
  FaShoppingBasket,
  FaUtensils,
  FaWater,
  FaTree,
  FaHeart as FaHeartIcon,
} from "react-icons/fa";

// fa6 icons (FaMosque, FaHandHoldingHeart, FaCarrot, FaEgg, FaDove, FaWheatAwn, FaHands are in fa6)
import {
  FaMosque,
  FaHandHoldingHeart,
  FaCarrot,
  FaEgg,
  FaDove,
  FaWheatAwn,       // replaces FaWheatAlt
  FaHands,
} from "react-icons/fa6";

import { LuSprout, LuGraduationCap } from "react-icons/lu";
import { GiMedicinePills, GiCow } from "react-icons/gi";
import { X, Apple } from "lucide-react"; // Apple replaces FormInputIcon for fruits

export default function DonationForm() {
  const [loading, setLoading] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedCharityType, setSelectedCharityType] = useState("");
  const [selectedSadaqahType, setSelectedSadaqahType] = useState("");
  const [selectedAnimal, setSelectedAnimal] = useState("");
  const [showSadaqahOptions, setShowSadaqahOptions] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    clearErrors,
  } = useForm();

  // Watch form values
  const charityType = watch("charityType");
  const sadaqahType = watch("sadaqahType");

  // Update UI when charity type changes
  useEffect(() => {
    setSelectedCharityType(charityType);
    if (charityType !== "sadaqah") {
      setSelectedSadaqahType("");
      setShowSadaqahOptions(false);
    } else {
      setShowSadaqahOptions(true);
    }
  }, [charityType]);

  // Main charity types with enhanced icons
  const charityTypes = [
    {
      value: "sadaqah",
      label: "Sadaqah",
      icon: <FaHandHoldingHeart className="text-emerald-500 text-xl" />,
      description: "Voluntary charity with categories",
      gradient: "from-emerald-400 to-teal-500",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700",
    },
    {
      value: "zakat",
      label: "Zakat",
      icon: <FiStar className="text-blue-500 text-xl" />,
      description: "Obligatory charity (2.5%)",
      gradient: "from-blue-400 to-indigo-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
    },
    {
      value: "usher",
      label: "Usher",
      icon: <FaWheatAwn className="text-amber-500 text-xl" />,
      description: "Agricultural charity (10% or 5%)",
      gradient: "from-amber-400 to-orange-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-700",
    },
    {
      value: "general",
      label: "General Donation",
      icon: <FiGift className="text-purple-500 text-xl" />,
      description: "All types of charitable causes",
      gradient: "from-purple-400 to-pink-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
    },
  ];

  // Sadaqah subcategories
  const sadaqahTypes = [
    {
      value: "wajibah",
      label: "Sadaqah Wajibah",
      icon: <FiAlertCircle className="text-rose-500 text-lg" />,
      description: "Obligatory charity",
      gradient: "from-rose-400 to-red-500",
      bgColor: "bg-rose-50",
    },
    {
      value: "naflah",
      label: "Sadaqah Naflah",
      icon: <FaHandHoldingHeart className="text-emerald-500 text-lg" />,
      description: "Voluntary charity",
      gradient: "from-emerald-400 to-green-500",
      bgColor: "bg-emerald-50",
    },
  ];

  // Wajibah subcategories
  const wajibahCategories = [
    {
      value: "qasam_ka_kaffara",
      label: "Qasam ka Kaffara",
      icon: <FiBook className="text-amber-600" />,
      description: "Expiation for broken oaths",
      amount: "Feed 10 poor people or fast 3 days",
    },
    {
      value: "sadaqat_ul_fitr",
      label: "Sadaqat ul Fitr",
      icon: <FaHeartIcon className="text-emerald-600" />,
      description: "Eid-ul-Fitr obligatory charity",
      amount: "Approx. PKR 200-300 per person",
    },
  ];

  // Naflah subcategories
  const naflahCategories = [
    {
      value: "boys_madrasa",
      label: "Boys Madrasa",
      icon: <FaSchool className="text-blue-600" />,
      description: "Islamic education for boys",
    },
    {
      value: "girls_madrasa",
      label: "Girls Madrasa",
      icon: <FaSchool className="text-pink-600" />,
      description: "Islamic education for girls",
    },
    {
      value: "masjid",
      label: "Masjid Construction",
      icon: <FaMosque className="text-green-600" />,
      description: "Mosque building and maintenance",
    },
    {
      value: "islamic_books",
      label: "Islamic Books",
      icon: <FaBook className="text-yellow-600" />,
      description: "Printing and distribution",
    },
    {
      value: "construction",
      label: "Construction Work",
      icon: <FaBuilding className="text-orange-600" />,
      description: "Building projects",
    },
    {
      value: "ration",
      label: "Poor Families Support",
      icon: <FaShoppingBasket className="text-red-500" />,
      description: "Monthly ration distribution",
    },
    {
      value: "food_distribution",
      label: "Food Distribution",
      icon: <FaUtensils className="text-emerald-500" />,
      description: "Daily food for needy",
    },
    {
      value: "water_wells",
      label: "Water Wells",
      icon: <FaWater className="text-cyan-500" />,
      description: "Clean water projects",
    },
    {
      value: "medical_aid",
      label: "Medical Aid",
      icon: <GiMedicinePills className="text-red-500" />,
      description: "Healthcare for needy",
    },
    {
      value: "education_support",
      label: "Education Support",
      icon: <LuGraduationCap className="text-purple-500" />,
      description: "School fees & supplies",
    },
    {
      value: "orphan_support",
      label: "Orphan Support",
      icon: <FaHands className="text-amber-500" />,
      description: "Care for orphans",
    },
    {
      value: "animal_sacrifice",
      label: "Animal Sacrifice",
      icon: <GiCow className="text-amber-700" />,
      description: "Qurbani / Aqiqah donations",
      hasAnimals: true,
    },
  ];

  // General Donation Categories (all types)
  const generalCategories = [
    {
      value: "boys_madrasa",
      label: "Boys Madrasa",
      icon: <FaSchool className="text-blue-600" />,
      description: "Islamic education for boys",
    },
    {
      value: "girls_madrasa",
      label: "Girls Madrasa",
      icon: <FaSchool className="text-pink-600" />,
      description: "Islamic education for girls",
    },
    {
      value: "masjid",
      label: "Masjid Construction",
      icon: <FaMosque className="text-green-600" />,
      description: "Mosque building and maintenance",
    },
    {
      value: "islamic_books",
      label: "Islamic Books",
      icon: <FaBook className="text-yellow-600" />,
      description: "Printing and distribution",
    },
    {
      value: "construction",
      label: "Construction Work",
      icon: <FaBuilding className="text-orange-600" />,
      description: "Building projects",
    },
    {
      value: "ration",
      label: "Poor Families Support",
      icon: <FaShoppingBasket className="text-red-500" />,
      description: "Monthly ration distribution",
    },
    {
      value: "food_distribution",
      label: "Food Distribution",
      icon: <FaUtensils className="text-emerald-500" />,
      description: "Daily food for needy",
    },
    {
      value: "water_wells",
      label: "Water Wells",
      icon: <FaWater className="text-cyan-500" />,
      description: "Clean water projects",
    },
    {
      value: "medical_aid",
      label: "Medical Aid",
      icon: <GiMedicinePills className="text-red-500" />,
      description: "Healthcare for needy",
    },
    {
      value: "education_support",
      label: "Education Support",
      icon: <LuGraduationCap className="text-purple-500" />,
      description: "School fees & supplies",
    },
    {
      value: "orphan_support",
      label: "Orphan Support",
      icon: <FaHands className="text-amber-500" />,
      description: "Care for orphans",
    },
    {
      value: "tree_plantation",
      label: "Tree Plantation",
      icon: <FaTree className="text-green-600" />,
      description: "Environmental charity",
    },
    {
      value: "marriage_aid",
      label: "Marriage Aid",
      icon: <FaHeartIcon className="text-pink-500" />,
      description: "Help with marriage expenses",
    },
    {
      value: "funeral_expenses",
      label: "Funeral Expenses",
      icon: <FiPackage className="text-gray-600" />,
      description: "Support for funeral costs",
    },
    {
      value: "debt_relief",
      label: "Debt Relief",
      icon: <FiDollarSign className="text-red-500" />,
      description: "Help pay off debts",
    },
    {
      value: "animal_sacrifice",
      label: "Animal Sacrifice",
      icon: <GiCow className="text-amber-700" />,
      description: "Qurbani / Aqiqah donations",
      hasAnimals: true,
    },
  ];

  // Animal options for sacrifice
  const animalOptions = [
    {
      value: "bakra",
      label: "Bakra (Goat)",
      icon: <GiCow className="text-amber-700" />,
      description: "1 goat = 1 share",
      price: "Approx. PKR 35,000-45,000",
    },
    {
      value: "gaaye",
      label: "Gaaye (Cow)",
      icon: <GiCow className="text-brown-700" />,
      description: "1 cow = 7 shares",
      price: "Approx. PKR 120,000-150,000",
    },
    {
      value: "murghi",
      label: "Murghi (Chicken)",
      icon: <FaDove className="text-gray-600" />,
      description: "Chicken for poor families",
      price: "Approx. PKR 500-800",
    },
    {
      value: "anda",
      label: "Anda (Eggs)",
      icon: <FaEgg className="text-yellow-600" />,
      description: "Dozen eggs",
      price: "Approx. PKR 200-300/dozen",
    },
  ];

  // Usher categories
  const usherCategories = [
    {
      value: "gandum",
      label: "Gandum (Wheat)",
      icon: <FaWheatAwn className="text-amber-700" />,
      description: "10% of wheat harvest",
      unit: "Per 40 kg bag",
    },
    {
      value: "sabziyan",
      label: "Sabziyan (Vegetables)",
      icon: <FaCarrot className="text-orange-600" />,
      description: "5% of vegetable harvest",
      unit: "Per yield value",
    },
    {
      value: "kheti",
      label: "Kheti (Farming)",
      icon: <LuSprout className="text-green-600" />,
      description: "General agricultural produce",
      unit: "10% or 5% of harvest",
    },
    {
      value: "phal",
      label: "Phal (Fruits)",
      icon: <Apple className="text-purple-600" />,  // lucide-react Apple replaces FormInputIcon
      description: "Fruit harvest",
      unit: "10% or 5% of yield",
    },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("staff_token");
      if (!token) {
        redirect("/staff_login");
        return;
      }

      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(userData);

      reset({
        phone: "",
        email: "",
        donorName: "",
        amount: "",
        notes: "",
      });
    }
  }, [reset]);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const token = localStorage.getItem("staff_token");

      if (!token || token.split(".").length !== 3) {
        throw new Error("Session expired. Please login again.");
      }

      const donationData = {
        donorName: data.donorName,
        email: data.email,
        phone: data.phone,
        amount: Number(data.amount),
        charityType: data.charityType,
        sadaqahType: data.sadaqahType || null,
        category: data.category,
        animalType: data.animalType || null,
        usherType: data.usherType || null,
        notes: data.notes || "",
        sendEmail,
      };

      const response = await fetch("/api/addData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(donationData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      toast.success("Donation recorded successfully");
      reset();
      setSelectedCharityType("");
      setSelectedSadaqahType("");
      setSelectedAnimal("");
    } catch (error) {
      console.error("Donation submission error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Render charity type cards
  const renderCharityTypeCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {charityTypes.map((type) => (
        <div
          key={type.value}
          onClick={() => {
            setValue("charityType", type.value);
            setValue("sadaqahType", "");
            setValue("category", "");
            setValue("animalType", "");
            setValue("usherType", "");
            clearErrors();
          }}
          className={`relative group cursor-pointer transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 ${
            charityType === type.value
              ? "ring-4 ring-offset-4 ring-emerald-400/50 shadow-2xl"
              : "hover:shadow-xl"
          }`}
        >
          <div className={`bg-linear-to-br ${type.gradient} rounded-2xl p-6 shadow-lg overflow-hidden`}>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8"></div>

            <div className="relative z-10">
              <div className="bg-white/30 backdrop-blur-sm rounded-xl w-16 h-16 flex items-center justify-center mb-4 mx-auto shadow-lg">
                <div className="text-white text-3xl">{type.icon}</div>
              </div>
              <h3 className="text-white font-bold text-xl text-center mb-2">{type.label}</h3>
              <p className="text-white/90 text-xs text-center font-medium">{type.description}</p>

              {charityType === type.value && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-xl animate-pulse">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Render Sadaqah options
  const renderSadaqahOptions = () => (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-2 bg-linear-to-b from-emerald-400 to-teal-500 rounded-full"></div>
        <h3 className="text-xl font-bold text-gray-800">Select Sadaqah Type</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sadaqahTypes.map((type) => (
          <div
            key={type.value}
            onClick={() => {
              setValue("sadaqahType", type.value);
              setSelectedSadaqahType(type.value);
              setValue("category", "");
              setValue("animalType", "");
            }}
            className={`relative group cursor-pointer transition-all duration-500 ${
              sadaqahType === type.value
                ? "ring-2 ring-offset-2 ring-emerald-400 scale-[1.02]"
                : "hover:scale-[1.01]"
            }`}
          >
            <div className={`bg-linear-to-br ${type.gradient} rounded-xl p-5 shadow-lg hover:shadow-xl`}>
              <div className="flex items-center gap-4">
                <div className="bg-white/30 backdrop-blur-sm rounded-lg w-14 h-14 flex items-center justify-center">
                  <div className="text-white text-2xl">{type.icon}</div>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-lg">{type.label}</h4>
                  <p className="text-white/90 text-sm">{type.description}</p>
                </div>
                {sadaqahType === type.value && (
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Wajibah Categories */}
      {sadaqahType === "wajibah" && (
        <div className="mt-6 p-6 bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 shadow-xl">
          <h4 className="font-bold text-amber-800 mb-4 flex items-center gap-2 text-lg">
            <div className="p-2 bg-amber-200 rounded-lg">
              <FiAlertCircle className="text-amber-600 text-xl" />
            </div>
            Sadaqah Wajibah Categories
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wajibahCategories.map((cat) => (
              <div
                key={cat.value}
                onClick={() => setValue("category", cat.value)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                  watch("category") === cat.value
                    ? "border-amber-500 bg-amber-100 shadow-lg"
                    : "border-amber-200 bg-white/80 hover:border-amber-300 hover:bg-amber-50/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">{cat.icon}</div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{cat.label}</p>
                    <p className="text-xs text-gray-600 mt-1">{cat.description}</p>
                    <p className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full mt-2 inline-block font-medium">
                      {cat.amount}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Naflah Categories */}
      {sadaqahType === "naflah" && (
        <div className="mt-6 space-y-6">
          <div className="p-6 bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 shadow-xl">
            <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2 text-lg">
              <div className="p-2 bg-green-200 rounded-lg">
                <FaHandHoldingHeart className="text-green-600 text-xl" />
              </div>
              Sadaqah Naflah Categories
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {naflahCategories.map((cat) => (
                <div
                  key={cat.value}
                  onClick={() => {
                    setValue("category", cat.value);
                    if (!cat.hasAnimals) setValue("animalType", "");
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                    watch("category") === cat.value
                      ? "border-green-500 bg-green-100 shadow-lg"
                      : "border-green-200 bg-white/80 hover:border-green-300 hover:bg-green-50/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">{cat.icon}</div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{cat.label}</p>
                      <p className="text-xs text-gray-600 mt-1">{cat.description}</p>
                      {cat.hasAnimals && (
                        <span className="inline-block mt-2 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                          🐾 Animal sacrifice available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Animal Selection */}
          {watch("category") === "animal_sacrifice" && (
            <div className="p-6 bg-linear-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200 shadow-xl">
              <h4 className="font-bold text-amber-800 mb-4 flex items-center gap-2 text-lg">
                <div className="p-2 bg-amber-200 rounded-lg">
                  <GiCow className="text-amber-700 text-xl" />
                </div>
                Select Animal for Sacrifice
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {animalOptions.map((animal) => (
                  <div
                    key={animal.value}
                    onClick={() => {
                      setValue("animalType", animal.value);
                      setSelectedAnimal(animal.value);
                    }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                      selectedAnimal === animal.value
                        ? "border-amber-500 bg-amber-100 shadow-lg"
                        : "border-amber-200 bg-white/80 hover:border-amber-300 hover:bg-amber-50/50"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="text-4xl mb-2">{animal.icon}</div>
                      <p className="font-bold text-gray-800">{animal.label}</p>
                      <p className="text-xs text-gray-600 mt-1">{animal.description}</p>
                      <p className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full mt-2 font-medium">
                        {animal.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4 italic text-center bg-white/50 p-3 rounded-lg">
                💡 Note: Multiple shares can be purchased for cow sacrifice (1 cow = 7 shares)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Render General Donation options
  const renderGeneralOptions = () => (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-2 bg-linear-to-b from-purple-400 to-pink-500 rounded-full"></div>
        <h3 className="text-xl font-bold text-gray-800">All Donation Categories</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {generalCategories.map((cat) => (
          <div
            key={cat.value}
            onClick={() => {
              setValue("category", cat.value);
              if (!cat.hasAnimals) setValue("animalType", "");
            }}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${
              watch("category") === cat.value
                ? "border-purple-500 bg-purple-100 shadow-lg"
                : "border-purple-200 bg-white/80 hover:border-purple-300 hover:bg-purple-50/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg text-xl">{cat.icon}</div>
              <div className="flex-1">
                <p className="font-bold text-gray-800">{cat.label}</p>
                <p className="text-xs text-gray-600 mt-1">{cat.description}</p>
                {cat.hasAnimals && (
                  <span className="inline-block mt-2 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                    🐾 Animal sacrifice
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Animal Selection for General */}
      {watch("category") === "animal_sacrifice" && (
        <div className="p-6 bg-linear-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200 shadow-xl">
          <h4 className="font-bold text-amber-800 mb-4 flex items-center gap-2 text-lg">
            <div className="p-2 bg-amber-200 rounded-lg">
              <GiCow className="text-amber-700 text-xl" />
            </div>
            Select Animal for Sacrifice
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {animalOptions.map((animal) => (
              <div
                key={animal.value}
                onClick={() => {
                  setValue("animalType", animal.value);
                  setSelectedAnimal(animal.value);
                }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                  selectedAnimal === animal.value
                    ? "border-amber-500 bg-amber-100 shadow-lg"
                    : "border-amber-200 bg-white/80 hover:border-amber-300 hover:bg-amber-50/50"
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="text-4xl mb-2">{animal.icon}</div>
                  <p className="font-bold text-gray-800">{animal.label}</p>
                  <p className="text-xs text-gray-600 mt-1">{animal.description}</p>
                  <p className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full mt-2 font-medium">
                    {animal.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 italic text-center bg-white/50 p-3 rounded-lg">
            💡 Note: Multiple shares can be purchased for cow sacrifice (1 cow = 7 shares)
          </p>
        </div>
      )}
    </div>
  );

  // Render Usher options
  const renderUsherOptions = () => (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-2 bg-linear-to-b from-amber-400 to-orange-500 rounded-full"></div>
        <h3 className="text-xl font-bold text-gray-800">Usher Categories</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {usherCategories.map((cat) => (
          <div
            key={cat.value}
            onClick={() => setValue("usherType", cat.value)}
            className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${
              watch("usherType") === cat.value
                ? "border-amber-500 bg-amber-100 shadow-lg"
                : "border-amber-200 bg-white/80 hover:border-amber-300 hover:bg-amber-50/50"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-amber-100 rounded-full text-3xl mb-3">{cat.icon}</div>
              <p className="font-bold text-gray-800 text-lg">{cat.label}</p>
              <p className="text-xs text-gray-600 mt-1">{cat.description}</p>
              <p className="text-xs bg-amber-200 text-amber-800 px-3 py-1 rounded-full mt-3 font-medium">
                {cat.unit}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render category selection based on charity type
  const renderCategorySelection = () => {
    if (!charityType) return null;

    switch (charityType) {
      case "sadaqah":
        return renderSadaqahOptions();
      case "usher":
        return renderUsherOptions();
      case "general":
        return renderGeneralOptions();
      case "zakat":
        return (
          <div className="mt-8 p-6 bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-200 rounded-lg">
                <FiStar className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-lg font-bold text-blue-800">Zakat Information</h3>
            </div>
            <div className="bg-white/80 p-4 rounded-xl">
              <p className="text-blue-800">Standard Zakat calculation applies (2.5% of wealth)</p>
              <p className="text-sm text-gray-600 mt-2">
                Please ensure the donor has calculated their Zakat correctly according to Islamic principles.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-6 md:p-8 w-full max-w-7xl border border-emerald-100/50">
        {/* Header with decorative elements */}
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-linear-to-r from-emerald-200/20 to-teal-200/20 rounded-3xl -m-4 blur-3xl"></div>
          <div className="relative text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-20 w-20 rounded-2xl bg-linear-to-br from-emerald-500 via-teal-500 to-green-500 flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <FaHandHoldingHeart className="h-10 w-10 text-white" />
              </div>
              <div className="h-20 w-20 rounded-2xl bg-linear-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <FiStar className="h-10 w-10 text-white" />
              </div>
              <div className="h-20 w-20 rounded-2xl bg-linear-to-br from-amber-500 via-orange-500 to-red-500 flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <FaWheatAwn className="h-10 w-10 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-black bg-linear-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-2">
                Donation Collection Form
              </h1>
              <p className="text-gray-500 text-lg">Record New Donation with Category Selection</p>
            </div>
          </div>

          {/* Decorative blobs */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-200/30 rounded-full -z-10 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-200/30 rounded-full -z-10 blur-3xl"></div>
        </div>

        {/* Staff Info Card */}
        <div className="relative mb-8">
          <div className="bg-linear-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm px-8 py-6 rounded-2xl border border-emerald-200 shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-linear-to-r from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                  <FiUser className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-emerald-600 font-medium">Welcome back,</p>
                  <p className="font-bold text-xl text-gray-800">{user?.name || "Staff Member"}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <FiMail className="h-3 w-3" />
                    {user?.email || "staff@example.com"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/60 px-6 py-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-600">Active Session</span>
                </div>
                <div className="w-px h-6 bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <FiClock className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium text-gray-600">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-center gap-8 mb-8 text-sm">
          <div className="flex items-center gap-3 bg-white/80 px-5 py-2.5 rounded-full shadow-md border border-emerald-100">
            <FiClock className="h-4 w-4 text-emerald-500" />
            <span className="font-medium text-gray-700">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-3 bg-white/80 px-5 py-2.5 rounded-full shadow-md border border-emerald-100">
            <FiFileText className="h-4 w-4 text-teal-500" />
            <span className="font-medium text-gray-700">
              DON-{new Date().getTime().toString().slice(-6)}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Donor Information */}
          <div className="bg-linear-to-br from-emerald-50/80 to-teal-50/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-emerald-100/50 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <FiUser className="h-6 w-6 text-emerald-600" />
              </div>
              Donor Information
              <span className="text-sm font-normal text-gray-400 ml-2">(All fields marked * are required)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Donor Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FiUser className="text-emerald-500" />
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("donorName", {
                    required: "Donor name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },
                  })}
                  placeholder="Enter donor's full name"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all bg-white/80 backdrop-blur-sm"
                />
                {errors.donorName && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1 bg-red-50 p-2 rounded-lg">
                    <span className="text-red-500">●</span> {errors.donorName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FiMail className="text-emerald-500" />
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="donor@example.com"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all bg-white/80 backdrop-blur-sm"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1 bg-red-50 p-2 rounded-lg">
                    <span className="text-red-500">●</span> {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FiUser className="text-emerald-500" />
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^03[0-9]{9}$/,
                      message: "Enter valid number (03XXXXXXXXX)",
                    },
                  })}
                  placeholder="03XXXXXXXXX"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all bg-white/80 backdrop-blur-sm"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1 bg-red-50 p-2 rounded-lg">
                    <span className="text-red-500">●</span> {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FiDollarSign className="text-emerald-500" />
                  Amount (PKR) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                    PKR
                  </span>
                  <input
                    type="number"
                    {...register("amount", {
                      required: "Amount is required",
                      min: { value: 1, message: "Minimum donation is PKR 1" },
                      max: { value: 100000000, message: "Maximum donation is PKR 100,000,000" },
                    })}
                    placeholder="Enter amount"
                    className="w-full p-4 pl-20 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all bg-white/80 backdrop-blur-sm"
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1 bg-red-50 p-2 rounded-lg">
                    <span className="text-red-500">●</span> {errors.amount.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Charity Type Selection */}
          <div className="bg-linear-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-blue-100/50 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <FiHome className="h-6 w-6 text-blue-600" />
              </div>
              Select Charity Type
            </h2>

            {renderCharityTypeCards()}
            {renderCategorySelection()}

            {/* Hidden inputs for form validation */}
            <input type="hidden" {...register("charityType", { required: "Please select charity type" })} />
            {charityType === "sadaqah" && (
              <input type="hidden" {...register("sadaqahType", { required: "Please select Sadaqah type" })} />
            )}
            {charityType === "sadaqah" && sadaqahType === "wajibah" && (
              <input type="hidden" {...register("category", { required: "Please select category" })} />
            )}
            {charityType === "sadaqah" && sadaqahType === "naflah" && (
              <input type="hidden" {...register("category", { required: "Please select category" })} />
            )}
            {charityType === "general" && (
              <input type="hidden" {...register("category", { required: "Please select category" })} />
            )}
            {charityType === "usher" && (
              <input type="hidden" {...register("usherType", { required: "Please select Usher type" })} />
            )}

            {errors.charityType && (
              <p className="mt-3 text-sm text-red-500 flex items-center gap-1 bg-red-50 p-3 rounded-lg">
                <span className="text-red-500">●</span> {errors.charityType.message}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="bg-linear-to-br from-gray-50/80 to-slate-50/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-gray-200/50 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-xl">
                <FiFileText className="h-6 w-6 text-gray-600" />
              </div>
              Additional Notes
            </h2>
            <textarea
              {...register("notes")}
              placeholder="Any special instructions, preferences, or additional details about this donation..."
              className="w-full p-5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 min-h-[140px] resize-none transition-all bg-white/80 backdrop-blur-sm"
              rows={4}
            />
          </div>

          {/* Email Notification */}
          <div className="bg-linear-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-purple-100/50 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl transition-all ${sendEmail ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}>
                  <FiMail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Send Email Receipt</h3>
                  <p className="text-sm text-gray-600">Donor will receive confirmation email with receipt</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSendEmail(!sendEmail)}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ${sendEmail ? "bg-green-500" : "bg-gray-300"}`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${sendEmail ? "translate-x-9" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                if (confirm("Clear all form data?")) {
                  reset({ phone: "", email: "", donorName: "", amount: "", notes: "" });
                  setSelectedCharityType("");
                  setSelectedSadaqahType("");
                  setSelectedAnimal("");
                  setSendEmail(true);
                  toast.success("Form cleared");
                }
              }}
              className="px-8 py-5 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all flex-1 flex items-center justify-center gap-2 disabled:opacity-50 text-lg hover:border-red-300 hover:text-red-600 group"
              disabled={loading}
            >
              <FiX className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              Clear Form
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-5 rounded-xl bg-linear-to-r from-emerald-500 via-teal-500 to-green-500 text-white font-bold shadow-xl hover:from-emerald-600 hover:via-teal-600 hover:to-green-600 hover:shadow-2xl active:scale-[0.98] transition-all flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              {loading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing Donation...
                </>
              ) : (
                <>
                  <FiSend className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  Submit Donation
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-emerald-700 font-medium">All donations are securely recorded and tracked</span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-400">
              <span className="font-medium">Version 4.0</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Secure Connection
              </span>
              <span>•</span>
              <span className="font-medium bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Islamic Charity System
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}