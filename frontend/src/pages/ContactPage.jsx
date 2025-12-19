import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';

const ContactPage = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen pt-20 px-4 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">{t('contact_page.title')}</h1>
            <div className="glass-panel p-8">
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6 text-gray-700 dark:text-gray-300">
                        <p>
                            {t('contact_page.desc')}
                        </p>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('contact_page.email_title')}</h3>
                            <p className="text-saffron">support@govassist.ai</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('contact_page.office_title')}</h3>
                            <p>
                                {t('contact_page.address.line1')}<br />
                                {t('contact_page.address.line2')}<br />
                                {t('contact_page.address.line3')}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/50 dark:bg-white/5 p-6 rounded-xl border border-gray-200 dark:border-white/10 backdrop-blur-sm shadow-sm dark:shadow-none">
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('contact_page.form.name_label')}</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full px-4 py-2 glass-input rounded-lg"
                                    placeholder={t('contact_page.form.name_placeholder')}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('contact_page.form.email_label')}</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-2 glass-input rounded-lg"
                                    placeholder={t('contact_page.form.email_placeholder')}
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('contact_page.form.message_label')}</label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    className="w-full px-4 py-2 glass-input rounded-lg resize-none"
                                    placeholder={t('contact_page.form.message_placeholder')}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full glass-button-primary text-white font-medium py-2 px-4 rounded-lg transform hover:scale-105 transition-all"
                            >
                                {t('contact_page.form.btn_send')}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-12 w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-lg border border-white/10 relative">
                    <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        title="Ajeenkya DY Patil University Map"
                        marginHeight="0"
                        marginWidth="0"
                        scrolling="no"
                        src="https://maps.google.com/maps?q=Ajeenkya%20DY%20Patil%20University&t=&z=15&ie=UTF8&iwloc=&output=embed"
                        style={{ filter: "invert(90%) hue-rotate(180deg)" }}
                    ></iframe>
                    <a
                        href="https://www.google.com/maps/dir//Ajeenkya+DY+Patil+University,+Charholi+Budruk,+via+Lohegaon,+Pune,+Maharashtra+412105"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 glass-button-primary px-6 py-2 rounded-lg flex items-center gap-2 text-white font-medium hover:scale-105 transition-transform shadow-lg z-10"
                    >
                        <MapPin size={18} />
                        {t('contact_page.form.get_directions')}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
