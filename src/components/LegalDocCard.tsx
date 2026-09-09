import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Eye } from 'lucide-react';
import { LegalDocument } from '@/utils/markdownLoader';
import { categoryColors, categoryIcons } from '@/lib/legalCategories';
import { useStrings } from '@/i18n/strings';

interface LegalDocCardProps {
    document: LegalDocument;
    onView: () => void;
}

const LegalDocCard: React.FC<LegalDocCardProps> = ({ document, onView }) => {
    const t = useStrings();
    const formattedDate = new Date(document.lastUpdated).toLocaleDateString(t.terminal.dateLocale);
    const CategoryIcon = categoryIcons[document.category];

    return (
        <Card className="group h-full border-l-4 border-l-blue-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-l-blue-400">
            <CardHeader className="pb-3">
                <div className="mb-2 flex items-center gap-2">
                    <CategoryIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <Badge variant="secondary" className={categoryColors[document.category]}>
                        {t.legal.categories[document.category]}
                    </Badge>
                    {document.project && (
                        <Badge variant="outline" className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                            {document.project.replace(/_/g, ' ')}
                        </Badge>
                    )}
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    {document.title.replace(/_/g, ' ')}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                    {document.description.replace(/_/g, ' ')}
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>{t.legalViewer.updatedOn(formattedDate)}</span>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onView}
                        className="flex items-center gap-2 transition-colors group-hover:border-blue-300 group-hover:bg-blue-50 dark:group-hover:border-blue-700 dark:group-hover:bg-blue-900/20"
                    >
                        <Eye className="h-4 w-4" />
                        {t.legal.viewButton}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default LegalDocCard;
