'use client';

import { useRouter } from 'next/navigation';
import { ChangeEvent, KeyboardEvent, useState } from 'react';

import { EditorFormType } from '@/app/editor/page';

import { postArticle, putArticle } from '@/api/articles';

interface Props {
  currentForm: EditorFormType;
  isEditMode: boolean;
  slug: string | null;
}

const EditorPageMain = ({ currentForm, isEditMode, slug }: Props) => {
  const router = useRouter();

  const [form, setForm] = useState<Props['currentForm']>(currentForm);
  const [currentTag, setCurrentTag] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setIsLoading(true);

    if (!isEditMode) {
      postArticle({
        article: { ...form },
      }).then((res) => {
        if (res?.errors) {
          const [[error, [type]]] = Object.entries(res.errors);
          setError(`${error} ${type}`);
        } else {
          const { slug } = res.article;
          router.push(`/article/${slug}`);

          setError(null);
        }

        setIsLoading(false);
      });
    } else if (isEditMode && slug) {
      putArticle(slug, {
        article: { ...form },
      }).then((res) => {
        if (res?.errors) {
          const [[error, [type]]] = Object.entries(res.errors);
          setError(`${error} ${type}`);
        } else {
          const { slug } = res.article;
          router.push(`/article/${slug}`);

          setError(null);
        }

        setIsLoading(false);
      });
    }
  };

  const handleChangeForm = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeTag = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setCurrentTag(value);
  };

  const handleKeyUpTag = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (currentTag.length < 1 || form.tagList.includes(currentTag)) {
        return;
      }

      setForm((prev) => ({ ...prev, tagList: [...prev.tagList, currentTag] }));
      setCurrentTag('');
    }
  };

  const handleDeleteTag = (deletedTag: string) => {
    const filteredTags = form.tagList.filter((tag) => tag !== deletedTag);

    setForm((prev) => ({ ...prev, tagList: filteredTags }));
  };

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            {error && (
              <ul className="error-messages">
                <li>{error}</li>
              </ul>
            )}

            <form>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                    name="title"
                    value={form.title}
                    onChange={handleChangeForm}
                    autoFocus
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="What's this article about?"
                    name="description"
                    value={form.description}
                    onChange={handleChangeForm}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows={8}
                    placeholder="Write your article (in markdown)"
                    name="body"
                    value={form.body}
                    onChange={handleChangeForm}
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter tags"
                    value={currentTag}
                    onChange={handleChangeTag}
                    onKeyUp={handleKeyUpTag}
                  />
                  <div className="tag-list">
                    {form.tagList.map((tag) => (
                      <span key={tag} className="tag-default tag-pill">
                        <i
                          className="ion-close-round"
                          onClick={() => handleDeleteTag(tag)}
                        ></i>{' '}
                        {tag}
                      </span>
                    ))}
                  </div>
                </fieldset>
                <button
                  className="btn btn-lg pull-xs-right btn-primary"
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPageMain;
