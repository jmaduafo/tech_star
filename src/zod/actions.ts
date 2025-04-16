"use server";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
  deleteUser,
} from "firebase/auth";
import {
  CreateContractorSchema,
  CreateContractSchema,
  CreateMemberSchema,
  CreatePaymentSchema,
  CreateProjectSchema,
  CreateStagesSchema,
  CreateUserSchema,
  EditStageSchema,
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
import { Amount, Item, UserItem } from "@/types/types";

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
      // created_at: serverTimestamp(),
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
    confirm: formData.get("confirm"),
    location: formData.get("location"),
    job_title: formData.get("job_title"),
    role: formData.get("role"),
    hire_type: formData.get("hire_type"),
  };

  if (values.confirm !== values.password) {
    return {
      message:
        "The password does not match the confirm password field. Please try again.",
      success: false,
    };
  }

  const result = CreateMemberSchema.safeParse(values);

  if (!result.success) {
    return {
      message: result.error.issues[0].message,
      success: false,
    };
  }

  const { first_name, last_name, email, password, location, job_title, hire_type, role } = result.data;

  try {
    const isEmailTaken = await checkUniqueUser(email);

    if (isEmailTaken) {
      return {
        message: "Email has already been used. Please choose another email.",
        success: false,
      };
    }
    
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
      id: user?.uid,
      first_name,
      last_name,
      full_name: `${first_name} ${last_name}`,
      email,
      team_id: getUser?.data()?.team_id,
      is_owner: false,
      is_online: false,
      bg_image_index: 0,
      job_title,
      hire_type,
      role,
      location,
      created_at: serverTimestamp(),
      updated_at: null,
    });

    return {
      data: {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm: "",
        location: "",
        job_title: "",
        role: "",
        hire_type: "",
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

export async function createContractor(
  prevState: any,
  formData: FormData,
  user: UserItem | undefined,
  project_id: string
) {
  const importance = formData.get("importance");

  const values = {
    location: formData.get("location"),
    importance_level: +importance!,
    is_unavailable: formData.get("status") === "on",
    name: formData.get("name"),
    additional_info: formData.get("additional"),
  };

  console.log(values);

  const result = CreateContractorSchema.safeParse(values);

  if (!result.success) {
    return {
      message: result.error.issues[0].message,
      success: false,
    };
  }

  const { name, importance_level, location, is_unavailable, additional_info } =
    result.data;

  try {
    if (!user) {
      return;
    }

    await addItem("contractors", {
      name: name.trim(),
      team_id: user?.team_id,
      project_id,
      location,
      importance_level: +importance_level,
      text: additional_info?.length ? additional_info : null,
      is_unavailable,
      created_at: serverTimestamp(),
      updated_at: null,
    });

    return {
      data: {
        location: "",
        importance: [2.5],
        is_unavailable: false,
        name: "",
        additional: "",
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

export async function createProject(
  prevState: any,
  formData: FormData,
  user: UserItem | undefined
) {
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
      success: false,
    };
  }
}

export async function createStage(
  prevState: any,
  formData: FormData,
  user: UserItem | undefined,
  project_id: string | undefined
) {
  const values = {
    name: formData.get("name"),
    description: formData.get("desc"),
  };

  const result = CreateStagesSchema.safeParse(values);

  if (!result.success) {
    return {
      message: result.error.issues[0].message,
      success: false,
    };
  }

  const { name, description } = result.data;

  if (!project_id) {
    console.log("Project ID is undefined");
    return;
  }

  try {
    await addItem("stages", {
      name: name.trim(),
      team_id: user?.team_id,
      project_id,
      description: description.trim(),
      is_completed: false,
      created_at: serverTimestamp(),
      updated_at: null,
    });

    return {
      data: {
        name: "",
        desc: "",
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

export async function editStage(
  prevState: any,
  formData: FormData,
  item: Item | undefined
) {
  const values = {
    name: formData.get("name"),
    description: formData.get("desc"),
    is_completed: formData.get("is_completed") === "on",
  };

  const result = EditStageSchema.safeParse(values);

  if (!result.success) {
    return {
      message: result.error.issues[0].message,
      success: false,
    };
  }

  const { name, description, is_completed } = result.data;

  try {
    if (!item) {
      return;
    }

    await updateItem("stages", item?.id, {
      name: name.trim(),
      description: description.trim(),
      is_completed,
      created_at: serverTimestamp(),
      updated_at: null,
    });

    return {
      data: {
        name: "",
        desc: "",
        is_complete: false,
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

export async function createContract(
  prevState: any,
  formData: FormData,
  user: UserItem | undefined,
  ids: { project_id: string; contractor_id: string },
  inputs: {
    dateInput: Date | undefined;
    bankNames: string[];
    currencies: Amount[];
  },
  contract: { id: string | null; code: string | null }
) {
  const values = {
    code: formData.get("code"),
    desc: formData.get("desc"),
    date: inputs.dateInput,
    bank_names: inputs.bankNames,
    stage_id: formData.get("stage_id"),
    currency: inputs.currencies,
    comment: formData.get("comment"),
    is_completed: formData.get("is_completed") === "on",
  };

  const result = CreateContractSchema.safeParse(values);

  if (!result.success) {
    return {
      message: result.error.issues[0].message,
      success: false,
    };
  }

  const {
    date,
    desc,
    bank_names,
    stage_id,
    comment,
    currency,
    code,
    is_completed,
  } = result.data;

  try {
    if (!user) {
      return;
    }

    await addItem("contracts", {
      date,
      project_id: ids.project_id,
      contractor_id: ids.contractor_id,
      team_id: user.team_id,
      stage_id,
      contract_code: code,
      bank_name: bank_names[0],
      currency_amount: currency[0].amount,
      currency_symbol: currency[0].symbol,
      currency_code: currency[0].code,
      currency_name: currency[0].name,
      is_completed,
      description: desc.trim(),
      comment: comment ? comment.trim() : null,
      is_contract: true,
      created_at: serverTimestamp(),
      updated_at: null,
    });

    return {
      data: {
        code: "",
        desc: "",
        stage_id: "",
        comment: "",
        is_completed: false,
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

export async function createPayment(
  prevState: any,
  formData: FormData,
  user: UserItem | undefined,
  ids: { project_id: string; contractor_id: string },
  inputs: {
    dateInput: Date | undefined;
    bankNames: string[];
    currencies: Amount[];
  },
  contract: { id: string | null; code: string | null; stage_id: string | null }
) {
  const values = {
    desc: formData.get("desc"),
    date: inputs.dateInput,
    bank_names: inputs.bankNames,
    stage_id: formData.get("stage_id") ?? "payment",
    currency: inputs.currencies,
    comment: formData.get("comment"),
    is_completed: formData.get("is_completed") === "on",
  };

  const result = CreatePaymentSchema.safeParse(values);

  if (!result.success) {
    return {
      message: result.error.issues[0].message,
      success: false,
    };
  }

  const { date, desc, bank_names, stage_id, comment, currency, is_completed } =
    result.data;

  try {
    if (!user) {
      return;
    }

    await addItem("payments", {
      date,
      project_id: ids.project_id,
      contractor_id: ids.contractor_id,
      team_id: user.team_id,
      stage_id: stage_id === "payment" ? contract.stage_id : stage_id,
      contract_code: contract.code,
      contract_id: contract.id,
      bank_name: bank_names[0],
      currency_amount: currency[0].amount,
      currency_symbol: currency[0].symbol,
      currency_code: currency[0].code,
      currency_name: currency[0].name,
      is_completed,
      description: desc?.trim(),
      comment: comment ? comment.trim() : null,
      is_contract: false,
      created_at: serverTimestamp(),
      updated_at: null,
    });

    return {
      data: {
        desc: "",
        stage_id: "",
        comment: "",
        is_completed: false,
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
