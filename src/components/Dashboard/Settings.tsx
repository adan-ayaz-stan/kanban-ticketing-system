import {
  SupabaseClient,
  User,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Heading from "../Layout/Heading";
import Image from "next/image";
import { MdArrowBack, MdClose } from "react-icons/md";
import { useRouter } from "next/router";

export default function Settings({ closeSettings }) {
  const supabase = useSupabaseClient();
  const user = useUser();

  const [currentModal, setCurrentModal] = useState("");

  function closeModal() {
    closeSettings(false);
  }

  function goBackToDefault() {
    setCurrentModal("");
  }

  return (
    <motion.div
      onClick={closeModal}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        transition: {
          type: "keyframes",
          ease: "easeOut",
        },
      }}
      exit={{
        opacity: 0,
      }}
      className="flex items-center justify-center fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-50 z-50"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="bg-white rounded-xl p-4"
      >
        <div className="flex justify-between items-center">
          <Heading className={"mr-auto text-xl font-medium"}>
            Account Settings
          </Heading>

          {currentModal != "" && (
            <button onClick={goBackToDefault} type="button">
              <MdArrowBack
                size={36}
                className="p-1 hover:bg-gray-100 cursor-pointer rounded-lg"
              />
            </button>
          )}
          <MdClose
            onClick={closeModal}
            size={36}
            className="p-1 hover:bg-gray-100 cursor-pointer rounded-lg"
          />
        </div>

        {currentModal == "" && (
          <div className="flex flex-col gap-1 py-3">
            <button
              type="button"
              onClick={() => setCurrentModal("profile")}
              className="py-2 px-4 bg-[#111111] hover:opacity-90 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md rounded-lg "
            >
              Change my profile picture
            </button>
            <button
              type="button"
              onClick={() => setCurrentModal("name")}
              className="py-2 px-4 bg-blue-700 hover:opacity-90 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md rounded-lg "
            >
              Change my display name
            </button>
            <button
              type="button"
              onClick={() => setCurrentModal("password")}
              className="py-2 px-4 bg-red-600 hover:opacity-90 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md rounded-lg "
            >
              Change my password
            </button>
          </div>
        )}

        {currentModal == "profile" && (
          <ProfileImageChanger
            closeModal={closeModal}
            supabase={supabase}
            user={user}
          />
        )}
        {currentModal == "name" && (
          <DisplayNameChanger
            supabase={supabase}
            user={user}
            closeModal={closeModal}
          />
        )}
        {currentModal == "password" && (
          <PasswordChanger
            supabase={supabase}
            user={user}
            closeModal={closeModal}
          />
        )}
      </div>
    </motion.div>
  );
}

function DisplayNameChanger({
  supabase,
  user,
  closeModal,
}: {
  supabase: SupabaseClient;
  user: User;
  closeModal: () => void;
}) {
  const [processing, setProcessing] = useState<boolean>(false);

  async function formSubmitHandler(e) {
    e.preventDefault();
    setProcessing(true);
    const formData = new FormData(e.target);
    const name = formData.get("name");

    const { data, error } = await supabase
      .from("users")
      .update({
        name: name,
      })
      .eq("id", user.id);

    const changeInProjects = await supabase
      .from("projects")
      .update({
        owner_name: name,
      })
      .eq("owner_id", user.id);

    const changeInAuth = await supabase.auth.updateUser({
      data: {
        name: name,
      },
    });

    if (error == null) {
      console.log(changeInAuth);
      console.log(changeInProjects);
      console.log("Name successfully changed.");
      closeModal();
    }
    setProcessing(false);
  }

  return (
    <form onSubmit={formSubmitHandler} className="flex flex-col gap-2">
      <h2 className="font-bold">Change your display name</h2>
      <div className="relative ">
        <input
          type="text"
          id="name"
          className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
          name="name"
          placeholder="Your name"
          required
          maxLength={18}
        />
      </div>

      <button
        type="submit"
        disabled={processing}
        className="mx-auto p-3 bg-purple-100 hover:bg-purple-200 rounded-lg disabled:grayscale disabled:cursor-progress"
      >
        {processing ? "Processing request.." : "Submit"}
      </button>
    </form>
  );
}

function ProfileImageChanger({
  closeModal,
  supabase,
  user,
}: {
  supabase: SupabaseClient;
  user: User;
  closeModal: () => void;
}) {
  const [processing, setProcessing] = useState<boolean>(false);

  async function uploadPathToUserDatabase(path) {
    const imageLink = supabase.storage.from("profiles").getPublicUrl(path);
    const publicLink = imageLink.data.publicUrl;
    // Upon getting the public link
    console.log("Uploading data to user", user.id);
    const userInfo = await supabase
      .from("users")
      .update({
        image: publicLink,
      })
      .eq("id", user.id);
  }

  async function uploadImage(image) {
    const { data, error } = await supabase.storage
      .from("profiles")
      .upload(`${user.id}/profile`, image);

    if (error == null) {
      console.log("image uploaded");
      uploadPathToUserDatabase(data.path);
    } else if (error) {
      console.log(error);
    }
  }
  async function updateImage(image) {
    const { data, error } = await supabase.storage
      .from("profiles")
      .update(`${user.id}/profile`, image);

    if (error == null) {
      console.log("image updated");
      uploadPathToUserDatabase(data.path);
    } else if (error) {
      console.log(error);
    }
  }

  async function formSubmitHandler(e) {
    e.preventDefault();
    setProcessing(true);
    const formData = new FormData(e.target);
    const image = formData.get("profile");

    const userImageExists = await supabase
      .from("users")
      .select("image")
      .eq("id", user.id);
    const existingImageLink = userImageExists.data[0].image;

    if (existingImageLink == "") {
      console.log("Upload image");
      await uploadImage(image);
    } else {
      console.log("Update image");
      await updateImage(image);
    }

    setProcessing(false);
    closeModal();
  }

  function uploadImageToSite(event) {
    var input = event.target;
    var file = input.files[0];
    var preview = document.getElementById("preview");

    if (file) {
      var maxSizeInBytes = 1.5 * 1024 * 1024; // 1.5 MB

      if (file.size > maxSizeInBytes) {
        alert("Please select an image file smaller than 1.5 MB.");
        input.value = ""; // Reset the input field
        preview.removeAttribute("src"); // Remove the preview image
        return;
      }

      var allowedMimeTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
      ];

      if (!allowedMimeTypes.includes(file.type)) {
        alert("Please select a valid image file (PNG, JPEG, JPG, or WebP).");
        input.value = ""; // Reset the input field
        preview.removeAttribute("src"); // Remove the preview image
        return;
      }

      var reader = new FileReader();

      reader.onload = function (e) {
        preview.setAttribute("src", e.target.result);
      };

      reader.readAsDataURL(file);
    }
  }

  return (
    <form onSubmit={formSubmitHandler} className="flex flex-col gap-1">
      <h1 className="font-bold text-left w-full">Upload profile icon</h1>
      <img
        id="preview"
        src="#"
        alt="Preview"
        className="h-32 w-32 rounded-full object-cover bg-gray-100"
      />
      <div className={"flex items-center gap-2"}>
        <input
          name="profile"
          accept=".png, .jpeg, .jpg, .webp"
          capture="camera"
          type="file"
          required
          className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none"
          onChange={uploadImageToSite}
        />
      </div>
      <div className="flex flex-col mb-2">
        <span className="text-sm text-gray-400">
          Image size cannot be larger than 1.5MB.
        </span>
        <span className="text-sm text-gray-400">
          Image types allowed: jpg, png, webp, jpeg
        </span>
        <span className="text-sm text-gray-400 mt-2">
          You may need to wait for the new image to appear <br /> as the browser
          may cache the previous image to <br /> save data times.
        </span>
      </div>

      <button
        type="submit"
        disabled={processing}
        className="mx-auto p-3 bg-purple-100 hover:bg-purple-200 rounded-lg disabled:grayscale disabled:cursor-progress"
      >
        {processing ? "Processing request.." : "Submit"}
      </button>
    </form>
  );
}

function PasswordChanger({
  supabase,
  user,
  closeModal,
}: {
  supabase: SupabaseClient;
  user: User;
  closeModal: () => void;
}) {
  const router = useRouter();
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState("");

  async function formSubmitHandler(e) {
    e.preventDefault();
    setProcessing(true);
    const formData = new FormData(e.target);
    const pass = formData.get("password");
    const cpass = formData.get("c-password");

    if (pass !== cpass) {
      setError("Passwords in the two fields are different.");
      setProcessing(false);
      return;
    }

    const { data, error } = await supabase.auth.updateUser({
      password: `${pass}`,
    });

    if (error == null) {
      console.log("Password successfully changed.");
      await supabase.auth.signOut();
      closeModal();
      router.push("/");
    }

    setProcessing(false);
  }

  return (
    <form onSubmit={formSubmitHandler} className="flex flex-col gap-2">
      <h2 className="font-bold">Change your password</h2>

      <input
        type="password"
        id="password"
        onFocus={() => setError("")}
        className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
        name="password"
        placeholder="New Password"
        required
        minLength={8}
        maxLength={64}
      />
      <input
        type="password"
        id="c-password"
        onFocus={() => setError("")}
        className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
        name="c-password"
        placeholder="Confirm Password"
        required
        minLength={8}
        maxLength={64}
      />

      {error != "" && <span className="text-sm text-red-600">{error}</span>}

      <button
        type="submit"
        disabled={processing}
        className="mx-auto p-3 bg-red-300 hover:bg-red-200 rounded-lg disabled:grayscale disabled:cursor-progress"
      >
        {processing ? "Processing request.." : "Submit"}
      </button>
    </form>
  );
}
