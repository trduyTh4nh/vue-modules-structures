import { ref } from "vue";
import { projectApi } from "./project.api";

export const useProjectList = () => {
  const items = ref<any[]>([]);
  const loading = ref(false);
  const page = ref(1);
  const total = ref(0);
  const limit = ref(10);

  const flatProjectPost = (posts: any[]): any[] => {
    const data: any[] = [];

    for (const post of posts) {
      const comments = post.comments.length
        ? post.comments
        : [{ content: null, status: null }];

      comments.forEach((comment: any, index: number) => {
        data.push({
          groupId: post.id,
          groupIndex: index,
          groupTotal: comments.length,
          title: post.title,
          slug: post.slug,
          comment_content: comment.content,
          comment_status: comment.status,
        });
      });
    }

    return data;
  };

  const flatProjectPost2 = (posts: any[]) => {
    const data: any[] = [];

    for (const post of posts) {
      const comments = post.comments.length
        ? post.comments
        : [{ content: "-", status: "-" }];

      comments.forEach((comment: any, index: number) => {
        data.push({
          id: post.id + "-" + index,
          postId: post.id,
          title: post.title,
          slug: post.slug,
          comment_content: comment.content,
          comment_status: comment.status,
          rowspan: index === 0 ? comments.length : 0,
          isFirstRow: index === 0,
        });
      });
    }

    return data;
  };

  const fetchProject = async () => {
    loading.value = true;

    try {
      const params = {
        offset: page.value,
        limit: limit.value,
      };

      const res = await projectApi.getProjects(params);

      items.value = flatProjectPost(res.posts ?? []);
      // items.value = res.posts ?? [];
      total.value = res.total ?? 0;

      console.log(flatProjectPost(res.posts));
    } catch (error) {
      console.error("ERROR in useProject: ", error);
    } finally {
      loading.value = false;
    }
  };

  return {
    items,
    loading,
    total,
    page,
    limit,
    fetchProject,
  };
};

//  Response from API

// {
//     "message": "Post retrieved successfully",
//     "statusCode": 200,
//     "reasonStatus": "OK",
//     "metadata": {
//         "total": 29,
//         "page": "0",
//         "limit": "10",
//         "posts": [
//             {
//                 "id": "7271e1a0-9846-4e77-a494-8cfa24f3dcc2",
//                 "title": "Top 5 Vscode Extensions For React Developers",
//                 "slug": "top-5-vscode-extensions-for-react-developers",
//                 "content": "<h2>Boost Your React Workflow</h2><p>Visual Studio Code (VS Code) is the go-to editor for many web developers. Here are the top 5 extensions that will significantly improve your productivity when working with React:</p><ol><li>ES7+ React/Redux/React-Native snippets</li><li>Prettier - Code formatter</li><li>Auto Rename Tag</li><li>Import Cost</li><li>Code Spell Checker</li></ol>",
//                 "convert_url": null,
//                 "thumbnail": null,
//                 "status": "PUBLISHED",
//                 "view_count": 12,
//                 "vote_count": 0,
//                 "created_at": "2025-12-11T19:58:40.316Z",
//                 "updated_at": "2025-12-06T19:58:40.316Z",
//                 "author": null,
//                 "comments": [],
//                 "tags": []
//             },
//             {
//                 "id": "1846849e-9d7e-4886-b9dc-7193ec55ed42",
//                 "title": "How To Write Clean And Maintainable Code In Any Language",
//                 "slug": "how-to-write-clean-and-maintainable-code-in-any-language",
//                 "content": "<h2>Code Quality Matters</h2><p>Clean code is code that is easy to read, easy to change, and easy to understand. Focus on meaningful names, small functions, and clear separation of concerns, regardless of the programming language you use.</p>",
//                 "convert_url": null,
//                 "thumbnail": null,
//                 "status": "PUBLISHED",
//                 "view_count": 0,
//                 "vote_count": 0,
//                 "created_at": "2025-12-11T19:58:40.316Z",
//                 "updated_at": "2025-12-06T19:58:41.722Z",
//                 "author": null,
//                 "comments": [],
//                 "tags": []
//             },
//             {
//                 "id": "0847a1b4-0840-4680-bae2-e7fc1937ca2e",
//                 "title": "How To Handle Forms In React With Hooks",
//                 "slug": "how-to-handle-forms-in-react-with-hooks",
//                 "content": "<h2>Modern React Form Management</h2><p>Using the `useState` hook for controlled components is the standard approach for form inputs in modern React. For more complex forms, consider using libraries like Formik or React Hook Form.</p>",
//                 "convert_url": null,
//                 "thumbnail": null,
//                 "status": "PUBLISHED",
//                 "view_count": 10,
//                 "vote_count": 0,
//                 "created_at": "2025-12-11T19:58:40.316Z",
//                 "updated_at": "2025-12-06T19:58:41.084Z",
//                 "author": null,
//                 "comments": [],
//                 "tags": []
//             },
//             {
//                 "id": "5e874de8-aa21-45c0-b3f6-790e0a01f4c8",
//                 "title": "Getting Started With Nestjs Beginner Guide",
//                 "slug": "getting-started-with-nestjs-beginner-guide",
//                 "content": "<h2>Introduction to NestJS</h2><p><strong>NestJS</strong> is a progressive Node.js framework for building efficient, reliable and scalable server-side applications. It uses modern JavaScript, is built with and fully supports TypeScript (but still enables developers to code in pure JavaScript) and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).</p><p>This article will cover the basic setup and structure of a new NestJS project. Get ready to build your first powerful API!</p>",
//                 "convert_url": null,
//                 "thumbnail": null,
//                 "status": "PUBLISHED",
//                 "view_count": 3,
//                 "vote_count": 0,
//                 "created_at": "2025-12-11T19:58:40.316Z",
//                 "updated_at": "2025-12-06T19:58:40.178Z",
//                 "author": null,
//                 "comments": [
//                     {
//                         "id": "8b12084c-501d-4a91-ac97-7e3f04e1075f",
//                         "content": "I know how to code backend with nestjs after read this post",
//                         "status": "PENDING",
//                         "created_at": "2026-01-01T23:51:44.415Z",
//                         "updated_at": "2026-01-01T23:51:44.415Z"
//                     },
//                     {
//                         "id": "82c122ae-884b-404e-afc5-8cd2d2555a97",
//                         "content": "I also like this post, it help me understand about nestjs",
//                         "status": "PENDING",
//                         "created_at": "2026-01-01T23:50:39.872Z",
//                         "updated_at": "2026-01-01T23:50:39.872Z"
//                     },
//                     {
//                         "id": "ea46bc79-f929-4070-8337-cdd42643eb13",
//                         "content": "I really like this post\n",
//                         "status": "PENDING",
//                         "created_at": "2026-01-01T23:48:03.705Z",
//                         "updated_at": "2026-01-01T23:48:03.705Z"
//                     },
//                     {
//                         "id": "b22308de-5725-4eb4-b50a-1cbf4531315c",
//                         "content": "Add comment for test reset",
//                         "status": "PENDING",
//                         "created_at": "2026-01-01T20:05:19.739Z",
//                         "updated_at": "2026-01-01T20:05:19.739Z"
//                     },
//                     {
//                         "id": "05517b05-d80e-4af5-99d7-79364cdf5e73",
//                         "content": "I really helpful for me!",
//                         "status": "PENDING",
//                         "created_at": "2026-01-01T19:59:15.515Z",
//                         "updated_at": "2026-01-01T19:59:15.515Z"
//                     },
//                     {
//                         "id": "6dab6d22-b79e-413e-bef2-cf3eb25b9947",
//                         "content": "Nice post, I love it!",
//                         "status": "PENDING",
//                         "created_at": "2026-01-01T19:52:59.736Z",
//                         "updated_at": "2026-01-01T19:52:59.736Z"
//                     },
//                     {
//                         "id": "c8aeac6f-1399-4363-93bb-89387db14258",
//                         "content": "Amazing good job !",
//                         "status": "PENDING",
//                         "created_at": "2026-01-01T19:50:40.095Z",
//                         "updated_at": "2026-01-01T19:50:40.095Z"
//                     },
//                     {
//                         "id": "f60eb0f2-1fdb-44a2-862f-4775b0e382d1",
//                         "content": "Nice post bro!",
//                         "status": "PENDING",
//                         "created_at": "2026-01-01T19:41:30.578Z",
//                         "updated_at": "2026-01-01T19:41:30.578Z"
//                     }
//                 ],
//                 "tags": [
//                     {
//                         "id": "89f5320a-7da8-48d0-8607-ef05211d6af5",
//                         "name": "Python",
//                         "slug": "lap-trinh-python-co-ban",
//                         "created_at": "2026-01-16T08:02:15.014Z"
//                     }
//                 ]
//             }

//         ],
//         "hasNextPage": true,
//         "hasPrevPage": false
//     }
// }
