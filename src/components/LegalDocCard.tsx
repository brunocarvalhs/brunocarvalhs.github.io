import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, Eye } from 'lucide-react';
import { LegalDocument } from '@/utils/markdownLoader';

interface LegalDocCardProps {
    document: LegalDocument;
    onView: () => void;
}

const categoryLabels = {
    privacy: 'Privacidade',
    terms: 'Termos',
    accessibility: 'Acessibilidade',
    cookies: 'Cookies',
    data: 'Dados'
};

const categoryColors = {
    privacy: 'bg-blue-100 text-blue-800',
    terms: 'bg-green-100 text-green-800',
    accessibility: 'bg-purple-100 text-purple-800',
    cookies: 'bg-orange-100 text-orange-800',
    data: 'bg-red-100 text-red-800'
};

const LegalDocCard: React.FC<LegalDocCardProps> = ({ document, onView }) => {
    const formattedDate = new Date(document.lastUpdated).toLocaleDateString('pt-BR');

    return (
        <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <Badge
                            variant="secondary"
                            className={categoryColors[document.category]}
                        >
                            {categoryLabels[document.category]}
                        </Badge>
                        {document.project && (
                            <Badge variant="outline" className="bg-gray-100">
                                {document.project.replace(/_/g, ' ')}
                            </Badge>
                        )}
                    </div>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                    {document.title.replace(/_/g, ' ')}
                </CardTitle>
                <CardDescription className="text-gray-600">
                    {document.description.replace(/_/g, ' ')}
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>Atualizado em {formattedDate}</span>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onView}
                        className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
                    >
                        <Eye className="h-4 w-4" />
                        Visualizar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default LegalDocCard;
