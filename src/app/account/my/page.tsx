"use client";

import { deletePostById, getMyPosts, getPosts, writePost } from "@/utils/posts";
import { logOut, withdrawMembership } from "@/utils/auth";
import { useEffect, useState } from "react";

import { Post } from "@/types/post";
import { User } from "@/types/user";
import { getUser } from "@/utils/user";
import styles from "./page.module.scss";
import { useRouter } from "next/navigation";

export default function My() {
  const router = useRouter();
  const [inputTitle, setInputTitle] = useState<string>("");
  const [inputContent, setInputContent] = useState<string>("");

  const [isWritePostClicked, setIsWritePostClicked] = useState(false);

  const [fetchedPosts, setFetchedPosts] = useState<Post[]>([]);

  const [fetchedUser, setFetchedUser] = useState<User>();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMyPosts();
      setFetchedPosts(data.data);

      const userData = await getUser();

      setFetchedUser(userData[0]);
    };

    fetchData();
  }, [isWritePostClicked]);

  // TODO 총 페이지 수를 받아와서 다음 페이지 버튼을 비활성화 시키는 로직 구현
  return (
    <main className={styles.main}>
      <div className={styles.header}>My Account</div>
      <div className={styles.header}>
        {fetchedUser?.email}
        &nbsp;/&nbsp;
        {fetchedUser?.username}
      </div>
      <div className={styles.postsWrapper}>
        {fetchedPosts.map((post) => {
          const a = new Date(post.updated_at || post.created_at)
            .toLocaleString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
            .replace(/. /g, ".")
            .replace(/: /g, ":");
          return (
            <div
              className={styles.postItem}
              key={post.id}
              onClick={() => {
                router.push(`/posts/details/${post.id}`);
              }}
            >
              <div className={styles.postTitle}>{post.title}</div>
              <div className={styles.postBody}>{post.content}</div>
              <div className={styles.postBody}>{post.email}</div>
              <div className={styles.postBody}>{a}</div>
              <div className={styles.postBody}>{post.id}</div>
              {post.updated_at && (
                <div className={styles.postBody}>{"is Edited"}</div>
              )}
            </div>
          );
        })}
      </div>

      <input
        type="text"
        onChange={(input) => {
          setInputTitle(input.target.value);
        }}
        placeholder="title"
        className={styles.input}
      />
      <input
        type="text"
        onChange={(input) => {
          setInputContent(input.target.value);
        }}
        placeholder="content"
        className={styles.input}
      />
      <button
        className={styles.sortButton}
        onClick={async () => {
          if (!!inputTitle && !!inputContent) {
            const response = await writePost(inputTitle, inputContent);

            if ((response as { data?: string })?.data === "SUCCESS") {
              alert("게시물 작성에 성공했습니다.");
              setIsWritePostClicked(!isWritePostClicked);
            }
          }
        }}
      >
        {"게시물 작성"}
      </button>
      <button
        className={styles.sortButton}
        onClick={async () => {
          const response = await logOut();

          // @ts-ignore
          if (response.data === "SUCCESS") {
            alert("로그아웃에 성공했습니다.");
            router.push("/auth/login");
          }
        }}
      >
        {"로그아웃"}
      </button>

      <button
        className={styles.sortButton}
        onClick={async () => {
          const response = await withdrawMembership();

          // @ts-ignore
          if (response.data === "SUCCESS") {
            alert("회원탈퇴에 성공했습니다.");
            router.push("/auth/login");
          }
        }}
      >
        {"회원탈퇴"}
      </button>
    </main>
  );
}
