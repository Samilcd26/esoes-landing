"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq } from '@/hooks/useFaqs';
import { Faq, CreateFaqRequest, UpdateFaqRequest } from '@/lib/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FaqCategory } from '@/lib/types/enum';
import { toast } from 'sonner';

const FaqManagement: React.FC = () => {
  const t = useTranslations('FaqManagement');
  const { data: faqs, isLoading, isError, refetch } = useFaqs();
  const createFaqMutation = useCreateFaq();
  const updateFaqMutation = useUpdateFaq();
  const deleteFaqMutation = useDeleteFaq();

  const { isPending: isCreatingFaq } = createFaqMutation;
  const { isPending: isUpdatingFaq } = updateFaqMutation;
  const { isPending: isDeletingFaq } = deleteFaqMutation;

  const isMutating = isCreatingFaq || isUpdatingFaq || isDeletingFaq;

  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [formData, setFormData] = useState<CreateFaqRequest>({
    question_tr: '',
    answer_tr: '',
    question_en: '',
    answer_en: '',
    category: FaqCategory.GENERAL,
    order: 0,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Hata mesajını temizle
  };

  const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Hata mesajını temizle
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.question_tr.trim()) newErrors.question_tr = t('validation.required');
    if (!formData.answer_tr.trim()) newErrors.answer_tr = t('validation.required');
    if (!formData.question_en.trim()) newErrors.question_en = t('validation.required');
    if (!formData.answer_en.trim()) newErrors.answer_en = t('validation.required');
    // Category ve Order isteğe bağlı olduğundan burada kontrol edilmedi.
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error(t('validation.fillAllFields'));
      return;
    }

    try {
      if (editingFaq) {
        await updateFaqMutation.mutateAsync({ id: editingFaq.id, data: formData as UpdateFaqRequest });
        toast.success(t('updateSuccess'));
      } else {
        await createFaqMutation.mutateAsync(formData);
        toast.success(t('createSuccess'));
      }
      resetForm();
      refetch();
    } catch (error) {
      toast.error(t('operationError'));
      console.error('FAQ operation error:', error);
    }
  };

  const resetForm = () => {
    setEditingFaq(null);
    setFormData({
      question_tr: '',
      answer_tr: '',
      question_en: '',
      answer_en: '',
      category: FaqCategory.GENERAL,
      order: 0,
    } as CreateFaqRequest); // Cast to CreateFaqRequest
    setErrors({});
  };

  const handleDeleteFaq = async (id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      try {
        await deleteFaqMutation.mutateAsync(id);
        toast.success(t('deleteSuccess'));
        refetch();
      } catch (error) {
        toast.error(t('operationError'));
        console.error('FAQ delete error:', error);
      }
    }
  };

  const startEditing = (faq: Faq) => {
    setEditingFaq(faq);
    setFormData({
      question_tr: faq.question_tr,
      answer_tr: faq.answer_tr,
      question_en: faq.question_en,
      answer_en: faq.answer_en,
      category: faq.category,
      order: faq.order,
    } as CreateFaqRequest); // Cast to CreateFaqRequest
    setErrors({});
  };

  if (isLoading) return <div className="text-center py-8">{t('common.loading')}</div>;
  if (isError) return <div className="text-center py-8 text-red-500">{t('common.error')}</div>;

  return (
    <div className="space-y-8 p-4">
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {editingFaq ? t('editFaq') : t('addFaq')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="question_tr" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('questionTr')} <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              id="question_tr"
              name="question_tr"
              value={formData.question_tr}
              onChange={handleInputChange}
              className={`border ${errors.question_tr ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.question_tr && <p className="text-red-500 text-xs mt-1">{errors.question_tr}</p>}
          </div>
          <div>
            <label htmlFor="answer_tr" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('answerTr')} <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="answer_tr"
              name="answer_tr"
              value={formData.answer_tr}
              onChange={handleInputChange}
              className={`border ${errors.answer_tr ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.answer_tr && <p className="text-red-500 text-xs mt-1">{errors.answer_tr}</p>}
          </div>
          <div>
            <label htmlFor="question_en" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('questionEn')} <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              id="question_en"
              name="question_en"
              value={formData.question_en}
              onChange={handleInputChange}
              className={`border ${errors.question_en ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.question_en && <p className="text-red-500 text-xs mt-1">{errors.question_en}</p>}
          </div>
          <div>
            <label htmlFor="answer_en" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('answerEn')} <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="answer_en"
              name="answer_en"
              value={formData.answer_en}
              onChange={handleInputChange}
              className={`border ${errors.answer_en ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.answer_en && <p className="text-red-500 text-xs mt-1">{errors.answer_en}</p>}
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('category.title')}
            </label>
            <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{t('category.selectCategory')}</SelectLabel>
          {Object.values(FaqCategory).map((category) => (
            <SelectItem key={category} value={t(`category.${category}`)}>
              {category}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
          </div>
          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('order')}
            </label>
            <Input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleNumericInputChange}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          {editingFaq && (
            <Button
              onClick={resetForm}
              variant="outline"
              disabled={isMutating}
            >
              {t('cancel')}
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={isMutating}
          >
            {isMutating ? t('common.loading') : (editingFaq ? t('updateFaq') : t('addFaq'))}
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('currentFaqs')}</h2>
        {faqs?.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">{t('noFaqs')}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {faqs?.map((faq) => (
              <div key={faq.id} className="p-4 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm bg-gray-50 dark:bg-neutral-700">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{t('questionTr')}:</p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">{faq.question_tr}</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{t('answerTr')}:</p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">{faq.answer_tr}</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{t('questionEn')}:</p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">{faq.question_en}</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{t('answerEn')}:</p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">{faq.answer_en}</p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('category')}: {faq.category || t('common.na')} | {t('order')}: {faq.order}
                </p>
                <div className="mt-4 flex space-x-2">
                  <Button onClick={() => startEditing(faq)} variant="outline" size="sm" disabled={isMutating}>
                    {t('edit')}
                  </Button>
                  <Button onClick={() => handleDeleteFaq(faq.id)} variant="destructive" size="sm" disabled={isMutating}>
                    {t('delete')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FaqManagement;