"use server";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
  deleteUser,
} from "firebase/auth";
import {
  CreateProjectSchema,
  CreateUserSchema,
  EmailValidation,
  LoginUserSchema,
  NamesValidation,
  PasswordValidation,
} from "./validation";
import { auth, db } from "@/firebase/config";
import {
  addItem,
  checkUniqueUser,
  deleteItem,
  updateItem,
} from "@/firebase/actions";
import {
  addDoc,
  collection,
  setDoc,
  doc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { User } from "@/types/types";

export async function signInUser(prevState: any, formData: FormData) {
  const values = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = LoginUserSchema.safeParse(values);

  if (!result.success) {
    return {
      message: result.error.issues[0].message,
      success: false,
    };
  }

  const { email, password } = result.data;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (userCredential.user) {
      return {
        success: true,
        message: "success",
        data: {
          email: "",
          password: "",
        },
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message,
    };
  }
}

export async function createAdmin(prevState: any, formData: FormData) {
  const values = {
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = CreateUserSchema.safeParse(values);

  if (!result.success) {
    return {
      message: result.error.issues[0].message,
      success: false,
    };
  }

  const { first_name, last_name, email, password } = result.data;

  const isEmailTaken = await checkUniqueUser(email);

  if (isEmailTaken) {
    return {
      message: "Email has already been used. Please choose another email.",
      success: false,
    };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    const newTeam = await addDoc(collection(db, "teams"), {
      name: `${first_name}'s team`,
      organization_name: null,
    });

    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      first_name,
      last_name,
      full_name: `${first_name} ${last_name}`,
      email,
      team_id: newTeam.id,
      is_owner: true,
      is_online: true,
      bg_image_index: 0,
      job_title: null,
      hire_type: "independent",
      role: "admin",
      location: null,
      created_at: serverTimestamp(),
      updated_at: null,
    });

    return {
      data: {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      },
      message: "success",
      success: true,
    };
  } catch (err: any) {
    return {
      message: err.message,
      success: false,
    };
  }
}

export async function createUser(prevState: any, formData: FormData) {
  const values = {
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = CreateUserSchema.safeParse(values);

  if (!result.success) {
    return {
      message: result.error.issues[0].message,
      success: false,
    };
  }

  const { first_name, last_name, email, password } = result.data;

  const isEmailTaken = await checkUniqueUser(email);

  if (isEmailTaken) {
    return {
      message: "Email has already been used. Please choose another email.",
      success: false,
    };
  }

  try {
    const authUser = auth.currentUser;

    if (!authUser) {
      return;
    }

    const [getUser, userCredential] = await Promise.all([
      getDoc(doc(db, "users", authUser?.uid)),
      createUserWithEmailAndPassword(auth, email, password),
    ]);

    const user = userCredential?.user;

    await setDoc(doc(db, "users", user?.uid), {
      id: authUser.uid,
      first_name,
      last_name,
      full_name: `${first_name} ${last_name}`,
      email,
      team_id: getUser?.data()?.team_id,
      is_owner: false,
      is_online: true,
      bg_image_index: 0,
      job_title: null,
      hire_type: "independent",
      role: "viewer",
      location: null,
      created_at: serverTimestamp(),
      updated_at: null,
    });

    return {
      data: {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      },
      message: "success",
      success: true,
    };
  } catch (err: any) {
    return {
      message: err.message,
      success: false,
    };
  }
}

export async function deleteThisUser(prevState: any, formData: FormData) {
  const values = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = LoginUserSchema.safeParse(values);

  if (!result.success) {
    return {
      message: result?.error.issues[0].message,
      success: false,
    };
  }

  const { email, password } = result.data;

  try {
    // FIRST LOG USER IN
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // ONCE USER IS SIGNED IN, THEN DELETE USER FROM THE AUTH DATABASE
    if (!user) {
      return;
    }

    deleteUser(user)
      .then(() => {
        const del = async () => {
          try {
            // THEN ALSO DELETE USER FROM FIRESTORE
            await deleteItem("users", user?.uid);
          } catch (err: any) {
            console.log(err.message);
          }
        };

        del();
      })
      .catch((error) => {
        return {
          message: error.message,
          success: false,
        };
      });

    //  ONCE DELETED, RETURN SUCCESS MESSAGE
    return {
      data: {
        email: "",
        password: "",
      },
      message: "success",
      success: true,
    };
  } catch (err: any) {
    return {
      message: err.message,
      success: false,
    };
  }
}

export async function changeNames(prevState: any, formData: FormData) {
  const values = {
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
  };

  const result = NamesValidation.safeParse(values);

  if (!result.success) {
    return {
      message: result.error.issues[0].message,
      success: false,
    };
  }

  const { first_name, last_name } = result.data;

  try {
    const user = auth?.currentUser;

    if (!user) {
      return;
    }

    await updateItem("user", user?.uid, {
      first_name,
      last_name,
      full_name: first_name + " " + last_name,
    });

    return {
      data: {
        first_name: "",
        last_name: "",
      },
      message: "success",
      success: true,
    };
  } catch (err: any) {
    return {
      message: err.message,
      success: false,
    };
  }
}

export async function changeEmail(prevState: any, formData: FormData) {
  const values = {
    email: formData.get("email"),
  };

  const result = EmailValidation.safeParse(values);

  if (!result.success) {
    return {
      message: result.error.issues[0].message,
      success: false,
    };
  }

  const { email } = result.data;

  try {
    const user = auth.currentUser;

    if (!user) {
      return;
    }

    await updateEmail(user, email);

    return {
      success: true,
      message: "success",
      data: {
        email: "",
      },
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message,
    };
  }
}

export async function changePassword(prevState: any, formData: FormData) {
  const values = {
    password: formData.get("password"),
  };

  const result = PasswordValidation.safeParse(values);

  if (!result.success) {
    return {
      message: result.error.issues[0].message,
      success: false,
    };
  }

  const { password } = result.data;

  try {
    const user = auth.currentUser;

    if (!user) {
      return;
    }

    await updatePassword(user, password);

    return {
      success: true,
      message: "success",
      data: {
        password: "",
      },
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message,
    };
  }
}

export async function createProject(prevState: any, formData: FormData, user: User | undefined) {
  const project_year = formData.get("year");

  const values = {
    name: formData.get("name"),
    year: project_year && +project_year,
    city: formData.get("city"),
    month: formData.get("month"),
    country: formData.get("country"),
  };

  const result = CreateProjectSchema.safeParse(values);

  if (!result.success) {
    return {
      message: result.error.issues[0].message,
      success: false,
    };
  }

  const { name, country, year, city, month } = result.data;

  try {
    if (!user) {
      return;
    }

    await addItem("projects", {
      name: name.trim(),
      team_id: user?.team_id,
      country,
      city: city ?? null,
      start_month: month,
      start_year: year,
      is_ongoing: true,
      created_at: serverTimestamp(),
      updated_at: null,
    });

    return {
      data: {
        month: "",
        city: "",
        country: "",
        name: "",
        year: "",
      },
      message: "success",
      success: true,
    };
  } catch (err: any) {
    return {
      message: err.message,
      success: false
    }
  }
}
