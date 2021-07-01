<script>
  import { beforeUpdate, afterUpdate, onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { URL, run, requestQlikBot } from "./lib/function/qlik";

  let div;
  let autoscroll;
  let requestValue;

  onMount(() => run());

  beforeUpdate(() => {
    autoscroll =
      div && div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
  });

  afterUpdate(() => {
    if ((autoscroll && isOpen) || (!requestValue?.img && isOpen))
      div.scrollTo(0, div.scrollHeight);
  });

  let comments = [
    {
      author: "qlik",
      text: "Hi! I'm Qlik Bot, what's up?",
      img: "",
      placeholder: false,
    },
  ];
  const loaded = new Map();

  const lazy = (node, data) => {
    if (loaded.has(data.src)) {
      node.setAttribute("src", data.src);
    } else {
      const img = new Image();
      img.src = data.src;
      img.onload = () => {
        loaded.set(data.src, img);
        div.scrollTo(0, div.scrollHeight);
        node.setAttribute("src", data.src);
      };
    }

    return {
      destroy() {}, // noop
    };
  };

  let isOpen = false;
  let inputText;

  const handleKeydown = (e) => {
    if (e.key === "Enter") {
      console.log(inputText);
      //   User input value
      comments = comments.concat({
        author: "user",
        text: inputText,
        img: "",
        placeholder: false,
      });
      // wating for the qlik response
      let newInputText = inputText;
      inputText = "";
      setTimeout(async () => {
        comments = comments.concat({
          author: "qlik",
          text: "...",
          img: "",
          placeholder: true,
        });

        requestValue = await requestQlikBot(newInputText);
        // Qlik Response
        comments = comments
          .filter((comment) => !comment.placeholder)
          .concat({
            author: "qlik",
            text: requestValue.result,
            img: requestValue.img,
            placeholder: false,
          });
      }, 800);
    }
  };
</script>

<div
  class="chat__button"
  on:click={() => {
    isOpen = !isOpen;
  }}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    aria-hidden="true"
    focusable="false"
    width="3em"
    height="3em"
    style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 1179 1000"
    ><path
      d="M1179 465q0 126-79 233.5T885 868t-296 62q-122 0-234-39l2 3L0 1001q44-59 70.5-126.5T102 769l4-38Q0 611 0 465q0-126 79-233T293.5 63T589 1t296 62t215 169t79 233zm-250 0q0-29-21-50t-51-21q-29 0-50 21t-21 50q0 30 21 51t50 21q30 0 51-21t21-51zm-250 0q0-29-21-50t-51-21q-29 0-50 21t-21 50q0 30 21 51t50 21q30 0 51-21t21-51zm-250 0q0-29-21-50t-51-21q-29 0-50 21t-21 50q0 30 21 51t50 21q30 0 51-21t21-51z"
      fill="#626262"
    /><rect
      x="0"
      y="0"
      width="1179"
      height="1000"
      fill="rgba(0, 0, 0, 0)"
    /></svg
  >
</div>

{#if isOpen}
  <div class="chat__modal" transition:fly={{ y: 300, duration: 500 }}>
    <div class="chat__modal__header">
      <h1>Qlik Bot</h1>
      <span
        class="chat__modal__close"
        title="Close Modal"
        on:click={() => (isOpen = false)}
      />
    </div>
    <div class="chat__scrollable" bind:this={div}>
      <div class="chat__scrollable_container">
        {#each comments as comment}
          <article class={comment.author}>
            <span class="chat__scrollable__line"
              >{comment.text}
              {#if comment.img}
                <a href={`${URL}/${comment.img}`}
                  ><img
                    class="chat__scrollable__img"
                    src={`${URL}/${comment.img}`}
                    use:lazy={{ src: `${URL}/${comment.img}` }}
                    alt="Qlik Chartt"
                    width="100%"
                    height="100%"
                  /></a
                >
              {/if}
            </span>
          </article>
        {/each}
      </div>
    </div>
    <div class="chat__input">
      <input
        on:keydown={handleKeydown}
        placeholder="Enter your message"
        class="chat__input__text"
        bind:value={inputText}
      />
      <span
        class="chat__input__close"
        title="Cancel"
        on:click={() => (inputText = "")}
      />
    </div>
  </div>
{/if}

<style>
  .chat__modal {
    display: flex;
    flex-direction: column;
    height: max(50%, 200px);
    width: 420px;
    position: fixed;
    bottom: 4rem;
    right: 1.2rem;
    background: #fff;
    box-shadow: 0 0px 50px 0 rgba(0, 0, 0, 0.2);
    z-index: 9;
  }
  .chat__modal__header {
    display: flex;
    background: #6560c6;
    padding: 1.2rem 1rem;
    color: #eee;
    align-items: center;
  }
  .chat__modal__header h1 {
    width: 100%;
    margin: 0;
  }

  .chat__scrollable {
    flex: 1 1 auto;
    overflow-y: auto;
  }

  .chat__scrollable::-webkit-scrollbar {
    width: 7px;
  }

  .chat__scrollable::-webkit-scrollbar-thumb {
    background-color: #b3b3b3;
    border-radius: 10px;
  }

  .chat__scrollable__line {
    white-space: pre-line;
  }

  .chat__scrollable_container {
    padding: 0 1rem;
    width: 414px;
  }

  article {
    margin: 1rem 0;
  }

  .user {
    text-align: right;
  }

  .qlik span {
    padding: 0.5rem 1rem;
    display: inline-block;
    background-color: #eee;
    border-radius: 1em 1em 1em 0;
  }

  .user span {
    padding: 0.5rem 1rem;
    display: inline-block;
    background-color: #0074d9;
    color: white;
    border-radius: 1em 1em 0 1em;
    word-break: break-all;
  }

  .chat__scrollable__img {
    padding: 0.5rem 0;
    display: inline-block;
  }

  .chat__button {
    cursor: pointer;

    position: fixed;
    bottom: 10px;
    right: 18px;

    /* width: 280px; */
  }

  .chat__input {
    display: flex;
    gap: 10px;
    padding: 1rem;
  }

  .chat__input__text {
    width: 100%;
    border: 1px solid #eee;
    padding: 0.5rem;
  }
  .chat__modal__close {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    border-radius: 50%;
    padding: 0.8rem;
  }
  .chat__modal__close:before,
  .chat__modal__close:after {
    position: absolute;
    content: " ";
    height: 12px;
    width: 2px;
    background-color: #333;
  }
  .chat__input__close {
    opacity: 0.3;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.8rem;
  }
  .chat__input__close:hover {
    opacity: 1;
  }
  .chat__input__close:before,
  .chat__input__close:after {
    position: absolute;
    content: " ";
    height: 20px;
    width: 2px;
    background-color: #333;
  }
  .chat__input__close:before,
  .chat__modal__close:before {
    transform: rotate(45deg);
  }
  .chat__input__close:after,
  .chat__modal__close:after {
    transform: rotate(-45deg);
  }
</style>
