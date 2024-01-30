"use client";

import { deletePostById, getPostById, updatePostById } from "@/utils/posts";
import { useEffect, useMemo, useState } from "react";

import { Post } from "@/types/post";
import styles from "./page.module.scss";
import { useRouter } from "next/navigation";

export default function Details({ params }: { params: { id: number } }) {
  const router = useRouter();

  const [inputTitle, setInputTitle] = useState<string>("");
  const [inputContent, setInputContent] = useState<string>("");

  const [fetchedPost, setFetchedPost] = useState<Post>();
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const dateTimte = useMemo(
    () =>
      fetchedPost
        ? new Date(fetchedPost.updated_at || fetchedPost.created_at)
            .toLocaleString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
            .replace(/. /g, ".")
            .replace(/: /g, ":")
        : "",
    [fetchedPost]
  );
  // NOTE 수정하기 모드
  useEffect(() => {
    const fetchData = async () => {
      const data = await getPostById(params.id);

      // TODO 댓글 가져오기
      setFetchedPost(data);
    };

    fetchData();
  }, [params.id, isButtonClicked]);

  return (
    <main className={styles.main}>
      <button
        onClick={() => {
          router.push(`/posts/1`);
        }}
      >
        go Back
      </button>
      <div className={styles.postsWrapper}>
        <div className={styles.postItem}>
          <div className={styles.postTitle}>{fetchedPost?.title}</div>
          <div className={styles.postBody}>{fetchedPost?.content}</div>
          <div className={styles.postBody}>{dateTimte}</div>
        </div>
        {/* NOTE 로그인한 유저가 작성한 게시물이 아니면 수정, 삭제 버튼이 보이지 않도록 구현 */}
        <button
          onClick={async (e) => {
            e.stopPropagation();
            if (fetchedPost === undefined) return;

            const response = await deletePostById(fetchedPost.id);

            //@ts-ignore
            if (response.response.error) {
              //@ts-ignore
              alert(response.response.error);
              return;
            }

            if ((response as { data?: string })?.data === "SUCCESS") {
              alert("게시물 삭제에 성공했습니다.");
              setIsButtonClicked(!isButtonClicked);
              router.push(`/posts/1`);
            }
          }}
        >
          erase
        </button>

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
          onClick={async (e) => {
            e.stopPropagation();
            if (fetchedPost === undefined) return;

            const response = await updatePostById(
              fetchedPost.id,
              inputTitle,
              inputContent
            );

            //@ts-ignore
            if (response?.response?.error) {
              //@ts-ignore
              alert(response.response.error);
              return;
            }

            if ((response as { data?: string })?.data === "SUCCESS") {
              alert("게시물 수정에 성공했습니다.");
              setIsButtonClicked(!isButtonClicked);
            }
          }}
        >
          update
        </button>
      </div>
    </main>
  );
}
