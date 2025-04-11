"use server";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import {
  CreateUserSchema,
  EmailValidation,
  LoginUserSchema,
  PasswordValidation,
} from "./validation";
import { auth, db } from "@/firebase/config";
import { checkUniqueUser } from "@/firebase/actions";
import {
  addDoc,
  collection,
  setDoc,
  doc,
  serverTimestamp,
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

export async function createUser(prevState: any, formData: FormData, admin: User | undefined) {
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
    
        await setDoc(doc(db, "users", user.uid), {
          id: user.uid,
          first_name,
          last_name,
          full_name: `${first_name} ${last_name}`,
          email,
          team_id: admin?.team_id,
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
