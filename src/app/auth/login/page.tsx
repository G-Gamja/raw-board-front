"use client";

import { post } from "@/utils/axios";
import styles from "./page.module.scss";
import { useRouter } from "next/navigation";
import { useState } from "react";

// FIXME 최초 진입 쪽에 Wrapper로 구현하고 만약 쿠키가 없으면 로그인 페이지로 이동하게 구현
export default function Login() {
  const router = useRouter();
  const [inputId, setInputId] = useState<string>();
  const [inputPassword, setInputPassword] = useState<string>();

  const login = async (id?: string, password?: string) => {
    const data = await post("/api/auth/log-in", {
      email: id,
      password: password,
    });

    console.log("🚀 ~ login ~ data:", data);

    // const token = getCookie("Authentication");

    // NOTE 석세스 && 쿠키 있는지 확인
    if ((data as any).data === "SUCCESS") {
      router.push("/posts/1");
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.title}>
        <h1>Login</h1>
      </div>

      <input
        type="text"
        onChange={(input) => {
          setInputId(input.target.value);
        }}
        placeholder="email"
        className={styles.input}
      />
      <input
        type="password"
        onChange={(input) => {
          setInputPassword(input.target.value);
        }}
        placeholder="password"
        className={styles.input}
      />

      <button
        className={styles.loginButton}
        onClick={() => {
          login(inputId, inputPassword);
        }}
      >
        login
      </button>
    </main>
  );
}
