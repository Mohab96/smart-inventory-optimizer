import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { setCredentials } from "../../store/features/authSlice";
import ImageUpload from "./ImageUpload";
import { useTheme } from "../../components/common/ThemeContext";

const countryOptions = [
  { value: "+93", label: "Afghanistan (+93)" },
  { value: "+355", label: "Albania (+355)" },
  { value: "+213", label: "Algeria (+213)" },
  { value: "+1-684", label: "American Samoa (+1-684)" },
  { value: "+376", label: "Andorra (+376)" },
  { value: "+244", label: "Angola (+244)" },
  { value: "+1-264", label: "Anguilla (+1-264)" },
  { value: "+672", label: "Antarctica (+672)" },
  { value: "+1-268", label: "Antigua and Barbuda (+1-268)" },
  { value: "+54", label: "Argentina (+54)" },
  { value: "+374", label: "Armenia (+374)" },
  { value: "+297", label: "Aruba (+297)" },
  { value: "+61", label: "Australia (+61)" },
  { value: "+43", label: "Austria (+43)" },
  { value: "+994", label: "Azerbaijan (+994)" },
  { value: "+1-242", label: "Bahamas (+1-242)" },
  { value: "+973", label: "Bahrain (+973)" },
  { value: "+880", label: "Bangladesh (+880)" },
  { value: "+1-246", label: "Barbados (+1-246)" },
  { value: "+375", label: "Belarus (+375)" },
  { value: "+32", label: "Belgium (+32)" },
  { value: "+501", label: "Belize (+501)" },
  { value: "+229", label: "Benin (+229)" },
  { value: "+1-441", label: "Bermuda (+1-441)" },
  { value: "+975", label: "Bhutan (+975)" },
  { value: "+591", label: "Bolivia (+591)" },
  { value: "+387", label: "Bosnia and Herzegovina (+387)" },
  { value: "+267", label: "Botswana (+267)" },
  { value: "+55", label: "Brazil (+55)" },
  { value: "+246", label: "British Indian Ocean Territory (+246)" },
  { value: "+1-284", label: "British Virgin Islands (+1-284)" },
  { value: "+673", label: "Brunei (+673)" },
  { value: "+359", label: "Bulgaria (+359)" },
  { value: "+226", label: "Burkina Faso (+226)" },
  { value: "+257", label: "Burundi (+257)" },
  { value: "+855", label: "Cambodia (+855)" },
  { value: "+237", label: "Cameroon (+237)" },
  { value: "+1", label: "Canada (+1)" },
  { value: "+238", label: "Cape Verde (+238)" },
  { value: "+1-345", label: "Cayman Islands (+1-345)" },
  { value: "+236", label: "Central African Republic (+236)" },
  { value: "+235", label: "Chad (+235)" },
  { value: "+56", label: "Chile (+56)" },
  { value: "+86", label: "China (+86)" },
  { value: "+61", label: "Christmas Island (+61)" },
  { value: "+61", label: "Cocos Islands (+61)" },
  { value: "+57", label: "Colombia (+57)" },
  { value: "+269", label: "Comoros (+269)" },
  { value: "+682", label: "Cook Islands (+682)" },
  { value: "+506", label: "Costa Rica (+506)" },
  { value: "+385", label: "Croatia (+385)" },
  { value: "+53", label: "Cuba (+53)" },
  { value: "+599", label: "Curaçao (+599)" },
  { value: "+357", label: "Cyprus (+357)" },
  { value: "+420", label: "Czech Republic (+420)" },
  { value: "+243", label: "Democratic Republic of the Congo (+243)" },
  { value: "+45", label: "Denmark (+45)" },
  { value: "+253", label: "Djibouti (+253)" },
  { value: "+1-767", label: "Dominica (+1-767)" },
  { value: "+1-809", label: "Dominican Republic (+1-809)" },
  { value: "+670", label: "East Timor (+670)" },
  { value: "+593", label: "Ecuador (+593)" },
  { value: "+20", label: "Egypt (+20)" },
  { value: "+503", label: "El Salvador (+503)" },
  { value: "+240", label: "Equatorial Guinea (+240)" },
  { value: "+291", label: "Eritrea (+291)" },
  { value: "+372", label: "Estonia (+372)" },
  { value: "+251", label: "Ethiopia (+251)" },
  { value: "+500", label: "Falkland Islands (+500)" },
  { value: "+298", label: "Faroe Islands (+298)" },
  { value: "+679", label: "Fiji (+679)" },
  { value: "+358", label: "Finland (+358)" },
  { value: "+33", label: "France (+33)" },
  { value: "+594", label: "French Guiana (+594)" },
  { value: "+689", label: "French Polynesia (+689)" },
  { value: "+241", label: "Gabon (+241)" },
  { value: "+220", label: "Gambia (+220)" },
  { value: "+995", label: "Georgia (+995)" },
  { value: "+49", label: "Germany (+49)" },
  { value: "+233", label: "Ghana (+233)" },
  { value: "+350", label: "Gibraltar (+350)" },
  { value: "+30", label: "Greece (+30)" },
  { value: "+299", label: "Greenland (+299)" },
  { value: "+1-473", label: "Grenada (+1-473)" },
  { value: "+590", label: "Guadeloupe (+590)" },
  { value: "+1-671", label: "Guam (+1-671)" },
  { value: "+502", label: "Guatemala (+502)" },
  { value: "+44", label: "Guernsey (+44)" },
  { value: "+224", label: "Guinea (+224)" },
  { value: "+245", label: "Guinea-Bissau (+245)" },
  { value: "+592", label: "Guyana (+592)" },
  { value: "+509", label: "Haiti (+509)" },
  { value: "+504", label: "Honduras (+504)" },
  { value: "+852", label: "Hong Kong (+852)" },
  { value: "+36", label: "Hungary (+36)" },
  { value: "+354", label: "Iceland (+354)" },
  { value: "+91", label: "India (+91)" },
  { value: "+62", label: "Indonesia (+62)" },
  { value: "+98", label: "Iran (+98)" },
  { value: "+964", label: "Iraq (+964)" },
  { value: "+353", label: "Ireland (+353)" },
  { value: "+44", label: "Isle of Man (+44)" },
  { value: "+972", label: "Israel (+972)" },
  { value: "+39", label: "Italy (+39)" },
  { value: "+225", label: "Ivory Coast (+225)" },
  { value: "+1-876", label: "Jamaica (+1-876)" },
  { value: "+81", label: "Japan (+81)" },
  { value: "+44", label: "Jersey (+44)" },
  { value: "+962", label: "Jordan (+962)" },
  { value: "+7", label: "Kazakhstan (+7)" },
  { value: "+254", label: "Kenya (+254)" },
  { value: "+686", label: "Kiribati (+686)" },
  { value: "+965", label: "Kuwait (+965)" },
  { value: "+996", label: "Kyrgyzstan (+996)" },
  { value: "+856", label: "Laos (+856)" },
  { value: "+371", label: "Latvia (+371)" },
  { value: "+961", label: "Lebanon (+961)" },
  { value: "+266", label: "Lesotho (+266)" },
  { value: "+231", label: "Liberia (+231)" },
  { value: "+218", label: "Libya (+218)" },
  { value: "+423", label: "Liechtenstein (+423)" },
  { value: "+370", label: "Lithuania (+370)" },
  { value: "+352", label: "Luxembourg (+352)" },
  { value: "+853", label: "Macao (+853)" },
  { value: "+389", label: "Macedonia (+389)" },
  { value: "+261", label: "Madagascar (+261)" },
  { value: "+265", label: "Malawi (+265)" },
  { value: "+60", label: "Malaysia (+60)" },
  { value: "+960", label: "Maldives (+960)" },
  { value: "+223", label: "Mali (+223)" },
  { value: "+356", label: "Malta (+356)" },
  { value: "+692", label: "Marshall Islands (+692)" },
  { value: "+222", label: "Mauritania (+222)" },
  { value: "+230", label: "Mauritius (+230)" },
  { value: "+262", label: "Mayotte (+262)" },
  { value: "+52", label: "Mexico (+52)" },
  { value: "+691", label: "Micronesia (+691)" },
  { value: "+373", label: "Moldova (+373)" },
  { value: "+377", label: "Monaco (+377)" },
  { value: "+976", label: "Mongolia (+976)" },
  { value: "+382", label: "Montenegro (+382)" },
  { value: "+1-664", label: "Montserrat (+1-664)" },
  { value: "+212", label: "Morocco (+212)" },
  { value: "+258", label: "Mozambique (+258)" },
  { value: "+95", label: "Myanmar (+95)" },
  { value: "+264", label: "Namibia (+264)" },
  { value: "+674", label: "Nauru (+674)" },
  { value: "+977", label: "Nepal (+977)" },
  { value: "+31", label: "Netherlands (+31)" },
  { value: "+687", label: "New Caledonia (+687)" },
  { value: "+64", label: "New Zealand (+64)" },
  { value: "+505", label: "Nicaragua (+505)" },
  { value: "+227", label: "Niger (+227)" },
  { value: "+234", label: "Nigeria (+234)" },
  { value: "+683", label: "Niue (+683)" },
  { value: "+672", label: "Norfolk Island (+672)" },
  { value: "+850", label: "North Korea (+850)" },
  { value: "+1-670", label: "Northern Mariana Islands (+1-670)" },
  { value: "+47", label: "Norway (+47)" },
  { value: "+968", label: "Oman (+968)" },
  { value: "+92", label: "Pakistan (+92)" },
  { value: "+680", label: "Palau (+680)" },
  { value: "+970", label: "Palestine (+970)" },
  { value: "+507", label: "Panama (+507)" },
  { value: "+675", label: "Papua New Guinea (+675)" },
  { value: "+595", label: "Paraguay (+595)" },
  { value: "+51", label: "Peru (+51)" },
  { value: "+63", label: "Philippines (+63)" },
  { value: "+64", label: "Pitcairn (+64)" },
  { value: "+48", label: "Poland (+48)" },
  { value: "+351", label: "Portugal (+351)" },
  { value: "+1-787", label: "Puerto Rico (+1-787)" },
  { value: "+974", label: "Qatar (+974)" },
  { value: "+242", label: "Republic of the Congo (+242)" },
  { value: "+262", label: "Réunion (+262)" },
  { value: "+40", label: "Romania (+40)" },
  { value: "+7", label: "Russia (+7)" },
  { value: "+250", label: "Rwanda (+250)" },
  { value: "+590", label: "Saint Barthélemy (+590)" },
  { value: "+290", label: "Saint Helena (+290)" },
  { value: "+1-869", label: "Saint Kitts and Nevis (+1-869)" },
  { value: "+1-758", label: "Saint Lucia (+1-758)" },
  { value: "+590", label: "Saint Martin (+590)" },
  { value: "+508", label: "Saint Pierre and Miquelon (+508)" },
  { value: "+1-784", label: "Saint Vincent and the Grenadines (+1-784)" },
  { value: "+685", label: "Samoa (+685)" },
  { value: "+378", label: "San Marino (+378)" },
  { value: "+239", label: "São Tomé and Príncipe (+239)" },
  { value: "+966", label: "Saudi Arabia (+966)" },
  { value: "+221", label: "Senegal (+221)" },
  { value: "+381", label: "Serbia (+381)" },
  { value: "+248", label: "Seychelles (+248)" },
  { value: "+232", label: "Sierra Leone (+232)" },
  { value: "+65", label: "Singapore (+65)" },
  { value: "+421", label: "Slovakia (+421)" },
  { value: "+386", label: "Slovenia (+386)" },
  { value: "+677", label: "Solomon Islands (+677)" },
  { value: "+27", label: "South Africa (+27)" },
  { value: "+82", label: "South Korea (+82)" },
  { value: "+211", label: "South Sudan (+211)" },
  { value: "+34", label: "Spain (+34)" },
  { value: "+94", label: "Sri Lanka (+94)" },
  { value: "+249", label: "Sudan (+249)" },
  { value: "+597", label: "Suriname (+597)" },
  { value: "+47", label: "Svalbard and Jan Mayen (+47)" },
  { value: "+268", label: "Swaziland (+268)" },
  { value: "+46", label: "Sweden (+46)" },
  { value: "+41", label: "Switzerland (+41)" },
  { value: "+963", label: "Syria (+963)" },
  { value: "+886", label: "Taiwan (+886)" },
  { value: "+992", label: "Tajikistan (+992)" },
  { value: "+255", label: "Tanzania (+255)" },
  { value: "+66", label: "Thailand (+66)" },
  { value: "+228", label: "Togo (+228)" },
  { value: "+690", label: "Tokelau (+690)" },
  { value: "+676", label: "Tonga (+676)" },
  { value: "+1-868", label: "Trinidad and Tobago (+1-868)" },
  { value: "+216", label: "Tunisia (+216)" },
  { value: "+90", label: "Turkey (+90)" },
  { value: "+993", label: "Turkmenistan (+993)" },
  { value: "+1-649", label: "Turks and Caicos Islands (+1-649)" },
  { value: "+688", label: "Tuvalu (+688)" },
  { value: "+1-340", label: "U.S. Virgin Islands (+1-340)" },
  { value: "+256", label: "Uganda (+256)" },
  { value: "+380", label: "Ukraine (+380)" },
  { value: "+971", label: "United Arab Emirates (+971)" },
  { value: "+44", label: "United Kingdom (+44)" },
  { value: "+1", label: "United States (+1)" },
  { value: "+598", label: "Uruguay (+598)" },
  { value: "+998", label: "Uzbekistan (+998)" },
  { value: "+678", label: "Vanuatu (+678)" },
  { value: "+379", label: "Vatican City (+379)" },
  { value: "+58", label: "Venezuela (+58)" },
  { value: "+84", label: "Vietnam (+84)" },
  { value: "+681", label: "Wallis and Futuna (+681)" },
  { value: "+967", label: "Yemen (+967)" },
  { value: "+260", label: "Zambia (+260)" },
  { value: "+263", label: "Zimbabwe (+263)" },
];

export default function Register() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [managerData, setManagerData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Manager form – note the addition of `control`
  const {
    register: registerManager,
    handleSubmit: handleSubmitManager,
    trigger: triggerManager,
    control,
    formState: { errors: errorsManager },
  } = useForm();

  // Business form
  const {
    register: registerBusiness,
    handleSubmit: handleSubmitBusiness,
    trigger: triggerBusiness,
    formState: { errors: errorsBusiness },
  } = useForm();

  const steps = [{ number: 1 }, { number: 2 }, { number: 3 }];

  // Handle next step (manager form)
  const handleNextStep = async () => {
    const isValid = await triggerManager();
    if (isValid) {
      setErrorMessage("");
      handleSubmitManager((data) => {
        console.log(data);
        // Here's the fix: Make sure we're using the value from the select
        const countryCode = data.countryCode?.value || "+20"; // Default to Egypt if not selected
        const combinedPhoneNumber = countryCode + data.phoneNumber;
        console.log("Combined phone:", combinedPhoneNumber); // Debug line
        setManagerData({
          ...data,
          phoneNumber: combinedPhoneNumber,
        });
        setCurrentStep(currentStep + 1);
      })();
    }
  };

  // Handle business form submission
  const onSubmitBusiness = async (businessData) => {
    const isValid = await triggerBusiness();

    if (isValid && managerData) {
      // Combine manager and business data
      const { image, ...rest } = businessData;
      // Remove countryCode from being separately sent to the API
      const { countryCode, ...managerDataWithoutCountryCode } = managerData;

      const combinedData = {
        admin: {
          ...managerDataWithoutCountryCode,
          // Phone number should already be combined at this point
        },
        business: {
          ...rest,
          establishmentDate: new Date().toISOString(),
        },
      };

      console.log("Final phone number:", combinedData.admin.phoneNumber);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(combinedData),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw Error(data.message);
        }
        await dispatch(setCredentials(data.token));
        setCurrentStep(currentStep + 1);
      } catch (error) {
        setErrorMessage(error.message);
        console.log(error.message);
        if (errorMessage !== "Business name is required") setCurrentStep(1);
      }
    }
  };

  // Rest of the component remains the same
  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200'} py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200`}>
      <div className={`max-w-2xl w-full space-y-8 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-sm p-8 rounded-xl shadow-2xl ${theme === 'dark' ? 'border border-gray-700/50' : 'border border-gray-200/50'} transform transition-all duration-200`}>
        <div>
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Create your account
          </h2>
          <p className={`mt-2 text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Join our platform and start managing your business
          </p>
        </div>

        {/* Stepper */}
        <div className="flex justify-center mb-8">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  currentStep >= step.number
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {step.number}
              </div>
              {step.number !== steps.length && (
                <div
                  className={`w-[140px] h-1 transition-all duration-200 ${
                    currentStep > step.number
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                      : "bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {errorMessage && (
          <div className="animate-shake bg-red-900/30 text-red-200 rounded-lg p-4 text-sm flex items-center border border-red-700/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {errorMessage}
          </div>
        )}

        {/* Manager Form */}
        {currentStep === 1 && (
          <form className="space-y-4">
            <h3 className={`text-xl font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} mb-6`}>
              Manager Information
            </h3>
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Name
              </label>
              <input
                {...registerManager("name")}
                className={`appearance-none block w-full px-3 py-2 border ${theme === 'dark' ? 'border-gray-700 bg-gray-900/50 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${theme === 'dark' ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'} transform transition-all duration-200`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Email *
              </label>
              <input
                {...registerManager("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`appearance-none block w-full px-3 py-2 border ${theme === 'dark' ? 'border-gray-700 bg-gray-900/50 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${theme === 'dark' ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'} transform transition-all duration-200`}
              />
              {errorsManager.email && (
                <p className="mt-1 text-sm text-red-400">
                  {errorsManager.email.message}
                </p>
              )}
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Phone Number *
              </label>
              <div className="flex items-center space-x-2">
                <div className="w-[30%]">
                  <Controller
                    name="countryCode"
                    control={control}
                    defaultValue={{ value: "+20", label: "Egypt (+20)" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={countryOptions}
                        placeholder="Code"
                        isSearchable
                        className="react-select-container"
                        classNamePrefix="react-select"
                        styles={{
                          control: (base) => ({
                            ...base,
                            background: theme === 'dark' ? '#1f2937' : '#ffffff',
                            borderColor: "rgb(55, 65, 81)",
                            "&:hover": {
                              borderColor: "rgb(55, 65, 81)",
                            },
                          }),
                          menu: (base) => ({
                            ...base,
                            background: theme === 'dark' ? '#1f2937' : '#ffffff',
                            border: "1px solid rgb(55, 65, 81)",
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isFocused
                              ? "rgb(55, 65, 81)"
                              : "transparent",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "rgb(55, 65, 81)",
                            },
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: "white",
                          }),
                          input: (base) => ({
                            ...base,
                            color: "white",
                          }),
                        }}
                      />
                    )}
                  />
                </div>
                <input
                  {...registerManager("phoneNumber", {})}
                  className={`w-[70%] px-3 py-2 border ${theme === 'dark' ? 'border-gray-700 bg-gray-900/50 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${theme === 'dark' ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'} transform transition-all duration-200`}
                />
              </div>
              {errorsManager.phoneNumber && (
                <p className="mt-1 text-sm text-red-400">
                  {errorsManager.phoneNumber.message}
                </p>
              )}
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Username *
              </label>
              <input
                {...registerManager("username", {
                  required: "Username is required",
                })}
                className={`appearance-none block w-full px-3 py-2 border ${theme === 'dark' ? 'border-gray-700 bg-gray-900/50 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${theme === 'dark' ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'} transform transition-all duration-200`}
              />
              {errorsManager.username && (
                <p className="mt-1 text-sm text-red-400">
                  {errorsManager.username.message}
                </p>
              )}
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Password *
              </label>
              <input
                {...registerManager("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                type="password"
                className={`appearance-none block w-full px-3 py-2 border ${theme === 'dark' ? 'border-gray-700 bg-gray-900/50 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${theme === 'dark' ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'} transform transition-all duration-200`}
              />
              {errorsManager.password && (
                <p className="mt-1 text-sm text-red-400">
                  {errorsManager.password.message}
                </p>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={handleNextStep}
                className={`group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${theme === 'dark' ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'} transform transition-all duration-200 hover:scale-[1.02]`}
              >
                Next Step →
              </button>
            </div>
          </form>
        )}

        {/* Business Form */}
        {currentStep === 2 && (
          <form
            className="space-y-4"
            onSubmit={handleSubmitBusiness(onSubmitBusiness)}
          >
            <h3 className={`text-xl font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} mb-6`}>
              Business Information
            </h3>
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Business Name *
              </label>
              <input
                {...registerBusiness("name", {
                  required: "Business name is required",
                })}
                className={`appearance-none block w-full px-3 py-2 border ${theme === 'dark' ? 'border-gray-700 bg-gray-900/50 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${theme === 'dark' ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'} transform transition-all duration-200`}
              />
              {errorsBusiness.name && (
                <p className="mt-1 text-sm text-red-400">
                  {errorsBusiness.name.message}
                </p>
              )}
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Business Description
              </label>
              <textarea
                {...registerBusiness("description")}
                rows={3}
                placeholder="Write a brief description about your business"
                className={`appearance-none block w-full px-3 py-2 border ${theme === 'dark' ? 'border-gray-700 bg-gray-900/50 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${theme === 'dark' ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'} transform transition-all duration-200`}
              />
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                className={`text-sm font-medium text-gray-400 hover:text-gray-300 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-600 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                ← Back
              </button>
              <button
                type="submit"
                className={`group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${theme === 'dark' ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'} transform transition-all duration-200 hover:scale-[1.02]`}
              >
                Submit
              </button>
            </div>
          </form>
        )}

        {/* Image Upload Step */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className={`text-xl font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} mb-6`}>
              Upload Business Logo
            </h3>
            <ImageUpload isRegistrationFlow={true} />
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                className={`text-sm font-medium text-gray-400 hover:text-gray-300 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-600 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className={`group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${theme === 'dark' ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'} transform transition-all duration-200 hover:scale-[1.02]`}
              >
                Finish
              </button>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <p className={`mt-6 text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Already have an account?{" "}
            <Link
              to="/login"
              className={`font-medium ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} transition-colors duration-200`}
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
