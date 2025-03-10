"use client";

import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useRef,
  useEffect,
} from "react";

import Image from "next/image";
import Link from "next/link";

import LoadingSpinner from "@/c/loadingspinner";
import FormField from "@/c/formfields";
import useLocalStorage from "@/h/uselocalstorage";
import { Button } from "@/c/ui/button";
import { Schoolbell } from "next/font/google";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/c/ui/breadcrumb";
import { Loader, Navigation, Pencil, Send, TriangleAlert } from "lucide-react";
import { formatZodErrors, rsvpSchemaReal, rsvpSchemaFake } from "@/lib/zod";

const schoolbell = Schoolbell({
  weight: ["400"],
  style: "normal",
  display: "swap",
  subsets: ["latin"],
});

// Types & Interfaces
export interface FormDataBase {
  email: string;
  firstName: string;
  lastName: string;
  attendance: "Yes" | "No" | "Maybe";
}

export interface FormDataWithSleepover extends FormDataBase {
  sleepover: "Yes" | "No";
}

// Constants
const FORM_FIELD_MAPPINGS = {
  email: "entry.2015214495",
  firstName: "entry.1955431621",
  lastName: "entry.1464840886",
  attendance: "entry.2069152922",
  sleepover: "entry.1397446148",
};

// Pre-filled form data (for development)
const getDefaultFormData = (
  isReal: boolean
): FormDataBase | FormDataWithSleepover => {
  const baseData: FormDataBase = {
    email: "",
    firstName: "",
    lastName: "",
    attendance: "Yes",
  };

  return isReal
    ? ({ ...baseData, sleepover: "Yes" } as FormDataWithSleepover)
    : baseData;
};

const SubmissionSuccess: React.FC<{
  onEdit: () => void;
  isReal: boolean;
}> = ({ onEdit, isReal }) => (
  <div className="space-y-6 mb-10 px-8">
    <Breadcrumb className="mt-10">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            href={`${isReal ? "/" : "/sat"}`}
            className={`${schoolbell.className} text-lg`}
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className={`${schoolbell.className} text-lg`}>
            RSVP
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <div className="mx-auto px-4 flex items-center">
      <Image
        src={"/title.png"}
        alt="Jannea Eiden is Turning 19"
        width={2000}
        height={2000}
        className="w-full max-w-sm mx-auto"
      />
    </div>
    <div className="mx-auto px-4 mt-4">
      <Image
        src={"/cake.png"}
        alt="cake"
        width={2000}
        height={2000}
        className="w-full sm:w-2/4 max-w-sm mx-auto animate-jittery-1"
      />
    </div>
    <div
      className={`${schoolbell.className} mb-6 px-4 py-3 rounded text-center`}
    >
      <p className="text-3xl mb-2" style={{ fontFamily: "wcmano" }}>
        Thank you for your RSVP!
      </p>
      <p className="text-lg">
        Your response has been successfully recorded. You can revisit this page
        anytime to update your RSVP if needed.
      </p>
      <div className="mt-12 flex flex-col md:flex-row gap-x-4 items-center justify-center w-full">
        <Button
          onClick={onEdit}
          className={`w-full md:w-auto flex gap-x-4 items-center text-xl p-6 drop-shadow-lg cursor-pointer transition-colors duration-300 ${schoolbell.className}`}
        >
          <Pencil className=" animate-jittery-2 h-7 w-7" />
          Edit Response
        </Button>
        <Button
          asChild
          className="w-full md:w-auto p-6 text-xl cursor-pointer transition-colors duration-300"
          variant={"ghost"}
          size={"lg"}
        >
          <Link
            href="https://maps.app.goo.gl/9rYB34Lua1pgaDAS9"
            target="_blank"
            className={`flex items-center ${schoolbell.className}`}
          >
            <Navigation className="animate-jittery-3 " /> Get Directions
          </Link>
        </Button>
      </div>
    </div>
  </div>
);

const ExistingSubmissionNotice: React.FC = () => (
  <div
    className={`${schoolbell.className} mb-6 px-4 py-3 rounded text-center md:text-left flex flex-col items-center`}
  >
    <p className="mb-2 text-xl flex flex-col md:flex-row gap-x-2 items-center">
      <TriangleAlert className="text-primary md:h-12 h-24 md:w-12 w-24 animate-jittery-1" />
      You are editing your previous response.
    </p>
  </div>
);

const ErrorMessage: React.FC<{
  message: string;
}> = ({ message }) => (
  <div
    className={`mb-6 text-background rounded-lg px-4 py-2 text-xl text-center bg-primary animate-in ${schoolbell.className}`}
  >
    Error: {message}
  </div>
);

// Main component
interface RSVPFormProps {
  isReal: boolean;
}

const RSVPForm: React.FC<RSVPFormProps> = ({ isReal }) => {
  // Get the appropriate form URL based on isReal flag
  const GOOGLE_FORM_URL = isReal
    ? process.env.NEXT_PUBLIC_GOOGLE_FORM_URL
    : process.env.NEXT_PUBLIC_GOOGLE_FORM_URL_2;

  if (!GOOGLE_FORM_URL) {
    throw new Error(
      `ENV VAR NOT FOUND: ${
        isReal ? "NEXT_PUBLIC_GOOGLE_FORM_URL" : "NEXT_PUBLIC_GOOGLE_FORM_URL_2"
      } not found!`
    );
  }

  const [formData, setFormData] = useState<
    FormDataBase | FormDataWithSleepover
  >(getDefaultFormData(isReal));
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasExistingSubmission, setHasExistingSubmission] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hiddenFormRef = useRef<HTMLFormElement>(null);

  const { saveToLocalStorage, loadFromLocalStorage } = useLocalStorage();

  // Generate a storage key that includes the form type to keep separate submissions
  const storageKey = `rsvp-form-${isReal ? "real" : "fake"}`;

  // Load data from localStorage on component mount
  useEffect(() => {
    // Set a small timeout to ensure smooth loading transition
    const loadData = () => {
      const { data, isSubmitted: wasSubmitted } =
        loadFromLocalStorage(storageKey);

      if (data) {
        // Handle the case where saved data might not have the sleepover field
        if (isReal && !("sleepover" in data)) {
          setFormData({ ...data, sleepover: "Yes" } as FormDataWithSleepover);
        } else if (!isReal && "sleepover" in data) {
          // Remove sleepover field if it exists but shouldn't
          const { sleepover, ...restData } = data as FormDataWithSleepover;
          setFormData(restData);
        } else {
          setFormData(data);
        }
        setHasExistingSubmission(true);
        setIsSubmitted(wasSubmitted);
      } else {
        setFormData(getDefaultFormData(isReal));
      }

      setIsLoading(false);
    };

    // Small timeout to prevent flash of unstyled content
    setTimeout(loadData, 300);
  }, [isReal, storageKey]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Prepare validation data
    const validationData = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      willAttend: formData.attendance,
      ...(isReal && {
        willSleepOver: (formData as FormDataWithSleepover).sleepover,
      }),
    };

    const validation = isReal
      ? rsvpSchemaReal.safeParse(validationData)
      : rsvpSchemaFake.safeParse(validationData);

    if (!validation.success) {
      setError(formatZodErrors(validation.error));
      console.log(formatZodErrors(validation.error));
      setIsSubmitting(false);
      return;
    }

    try {
      if (hiddenFormRef.current) {
        // Get all input elements inside the form
        const inputs = hiddenFormRef.current.querySelectorAll("input");

        // Update input values
        inputs.forEach((input) => {
          const fieldName = Object.entries(FORM_FIELD_MAPPINGS).find(
            ([_, value]) => value === input.name
          )?.[0] as keyof typeof FORM_FIELD_MAPPINGS;

          if (fieldName && fieldName in formData) {
            input.value = formData[
              fieldName as keyof typeof formData
            ] as string;
          }
        });

        // Submit the form
        hiddenFormRef.current.submit();

        // Save to localStorage with the specific storage key
        saveToLocalStorage(formData, true, storageKey);

        setIsSubmitted(true);
        setHasExistingSubmission(true);
      } else {
        throw new Error("Hidden form not available");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("There was a problem submitting your RSVP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditResponse = (): void => {
    setIsSubmitted(false);
  };

  const handleCancelEditResponse = (): void => {
    setIsSubmitted(true);
  };

  // Loading screen while checking localStorage
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-sm mx-auto md:max-w-lg w-full">
      {/* Hidden iframe for form submission */}
      <iframe
        ref={iframeRef}
        name="hidden-iframe"
        style={{ display: "none", width: 0, height: 0, border: 0 }}
        title="Hidden Form Submission"
      />

      {/* Hidden form for Google Forms submission */}
      <form
        ref={hiddenFormRef}
        method="POST"
        target="hidden-iframe"
        action={GOOGLE_FORM_URL}
        style={{ display: "none" }}
      >
        <input
          type="hidden"
          name={FORM_FIELD_MAPPINGS.email}
          value={formData.email}
        />
        <input
          type="hidden"
          name={FORM_FIELD_MAPPINGS.firstName}
          value={formData.firstName}
        />
        <input
          type="hidden"
          name={FORM_FIELD_MAPPINGS.lastName}
          value={formData.lastName}
        />
        <input
          type="hidden"
          name={FORM_FIELD_MAPPINGS.attendance}
          value={formData.attendance}
        />
        {isReal && (
          <input
            type="hidden"
            name={FORM_FIELD_MAPPINGS.sleepover}
            value={(formData as FormDataWithSleepover).sleepover || "No"}
          />
        )}
      </form>

      {isSubmitted && (
        <SubmissionSuccess onEdit={handleEditResponse} isReal={isReal} />
      )}

      {!isSubmitted && (
        <form onSubmit={handleSubmit} className="space-y-6 mb-10 px-8">
          <Breadcrumb className="mt-10">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`${isReal ? "/" : "/sat"}`}
                  className={`${schoolbell.className} text-lg`}
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className={`${schoolbell.className} text-lg`}>
                  RSVP
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mx-auto px-4 flex items-center">
            <Image
              src={"/title.png"}
              alt="Jannea Eiden is Turning 19"
              width={2000}
              height={2000}
              className="w-full max-w-sm mx-auto"
            />
          </div>

          <h1
            className={`text-center font-bold text-5xl text-primary mt-10`}
            style={{ fontFamily: "wcmano" }}
          >
            RSVP Form
          </h1>
          {hasExistingSubmission && <ExistingSubmissionNotice />}

          {error && <ErrorMessage message={error} />}

          <FormField
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
          />

          <FormField
            id="firstName"
            label="First Name"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
          />

          <FormField
            id="lastName"
            label="Last Name"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            required
          />

          <FormField
            id="attendance"
            label="Attendance"
            type="select"
            value={formData.attendance}
            onChange={handleChange}
            placeholder="Attendance"
            options={["Yes", "No", "Maybe"]}
            required
          />

          {isReal && (
            <FormField
              id="sleepover"
              label="Sleepover"
              type="select"
              value={(formData as FormDataWithSleepover).sleepover}
              onChange={handleChange}
              placeholder="Sleepover"
              options={["Yes", "No"]}
              required
            />
          )}

          <h3 className={`${schoolbell.className} text-sm mt-12`}>
            By submitting this form, you confirm that the details provided are
            accurate and will be used solely for event planning.
          </h3>

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              size={"lg"}
              className={`${
                schoolbell.className
              } text-xl w-full bg-primary p-6 drop-shadow-lg cursor-pointer transition-colors duration-300 ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin animate-jittery-2 animate-delay-3" />{" "}
                  Sending
                </>
              ) : hasExistingSubmission ? (
                <>
                  <Pencil className="animate-jittery-2 animate-delay-3" />{" "}
                  Update
                </>
              ) : (
                <>
                  <Send className="animate-jittery-2 animate-delay-3" /> Send
                </>
              )}
            </Button>
            {hasExistingSubmission && (
              <Button
                disabled={isSubmitting}
                onClick={handleCancelEditResponse}
                size={"lg"}
                variant={"ghost"}
                className={`${
                  schoolbell.className
                } text-xl animate-jittery-3 animate-delay-3 w-full p-6 drop-shadow-lg cursor-pointer transition-colors duration-300 ${
                  isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default RSVPForm;
