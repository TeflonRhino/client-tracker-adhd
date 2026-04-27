{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 Menlo-Regular;}
{\colortbl;\red255\green255\blue255;\red183\green111\blue247;\red23\green24\blue24;\red202\green202\blue202;
\red212\green212\blue212;\red113\green192\blue131;\red109\green115\blue120;\red54\green192\blue160;}
{\*\expandedcolortbl;;\cssrgb\c77255\c54118\c97647;\cssrgb\c11765\c12157\c12549;\cssrgb\c83137\c83137\c83137;
\cssrgb\c86275\c86275\c86275;\cssrgb\c50588\c78824\c58431;\cssrgb\c50196\c52549\c54510;\cssrgb\c23922\c78824\c69020;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs28 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 import\cf4 \strokec4  \cf5 \strokec5 \{\cf4 \strokec4  defineConfig\cf5 \strokec5 ,\cf4 \strokec4  loadEnv \cf5 \strokec5 \}\cf4 \strokec4  \cf2 \strokec2 from\cf4 \strokec4  \cf6 \strokec6 'vite'\cf5 \strokec5 ;\cf4 \cb1 \strokec4 \
\cf2 \cb3 \strokec2 import\cf4 \strokec4  react \cf2 \strokec2 from\cf4 \strokec4  \cf6 \strokec6 '@vitejs/plugin-react'\cf5 \strokec5 ;\cf4 \cb1 \strokec4 \
\
\cf2 \cb3 \strokec2 export\cf4 \strokec4  \cf2 \strokec2 default\cf4 \strokec4  defineConfig\cf5 \strokec5 ((\{\cf4 \strokec4  mode \cf5 \strokec5 \})\cf4 \strokec4  \cf5 \strokec5 =>\cf4 \strokec4  \cf5 \strokec5 \{\cf4 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf4 \cb3   \cf2 \strokec2 const\cf4 \strokec4  env \cf5 \strokec5 =\cf4 \strokec4  loadEnv\cf5 \strokec5 (\cf4 \strokec4 mode\cf5 \strokec5 ,\cf4 \strokec4  process\cf5 \strokec5 .\cf4 \strokec4 cwd\cf5 \strokec5 (),\cf4 \strokec4  \cf6 \strokec6 ''\cf5 \strokec5 );\cf4 \cb1 \strokec4 \
\cb3   \cf2 \strokec2 return\cf4 \strokec4  \cf5 \strokec5 \{\cf4 \cb1 \strokec4 \
\cb3     plugins\cf5 \strokec5 :\cf4 \strokec4  \cf5 \strokec5 [\cf4 \strokec4 react\cf5 \strokec5 ()],\cf4 \cb1 \strokec4 \
\cb3     define\cf5 \strokec5 :\cf4 \strokec4  \cf5 \strokec5 \{\cf4 \cb1 \strokec4 \
\cb3       \cf7 \strokec7 // This maps the Vercel/System variables to the globals used in your code\cf4 \cb1 \strokec4 \
\cb3       \cf7 \strokec7 // so you don't have to change the React code at all.\cf4 \cb1 \strokec4 \
\cb3       __firebase_config\cf5 \strokec5 :\cf4 \strokec4  \cf8 \strokec8 JSON\cf5 \strokec5 .\cf4 \strokec4 stringify\cf5 \strokec5 (\cf4 \strokec4 env\cf5 \strokec5 .\cf8 \strokec8 VITE_FIREBASE_CONFIG\cf4 \strokec4  \cf5 \strokec5 ||\cf4 \strokec4  \cf6 \strokec6 '\{\}'\cf5 \strokec5 ),\cf4 \cb1 \strokec4 \
\cb3       __app_id\cf5 \strokec5 :\cf4 \strokec4  \cf8 \strokec8 JSON\cf5 \strokec5 .\cf4 \strokec4 stringify\cf5 \strokec5 (\cf4 \strokec4 env\cf5 \strokec5 .\cf8 \strokec8 VITE_APP_ID\cf4 \strokec4  \cf5 \strokec5 ||\cf4 \strokec4  \cf6 \strokec6 'adhd-client-tracker'\cf5 \strokec5 ),\cf4 \cb1 \strokec4 \
\cb3       __initial_auth_token\cf5 \strokec5 :\cf4 \strokec4  \cf6 \strokec6 'undefined'\cf4 \cb1 \strokec4 \
\cb3     \cf5 \strokec5 \}\cf4 \cb1 \strokec4 \
\cb3   \cf5 \strokec5 \};\cf4 \cb1 \strokec4 \
\pard\pardeftab720\partightenfactor0
\cf5 \cb3 \strokec5 \});\cf4 \cb1 \strokec4 \
}