package br.com.will.marcador_api.dtos.response;

public record ReadingGoalResponse(
        Integer year,
        Integer targetBooks,
        Long completedBooks,
        Double progressPercentage,
        Boolean isCompleted
) {
    public static ReadingGoalResponse of(Integer targetBooks, Integer year, Long completedBooks) {
        double percentage = targetBooks > 0 ? (completedBooks.doubleValue() / targetBooks) * 100 : 0.0;
        double formattedPercentage = Math.min(Math.round(percentage * 10.0) / 10.0, 100.0);

        return new ReadingGoalResponse(
                year,
                targetBooks,
                completedBooks,
                formattedPercentage,
                completedBooks >= targetBooks
        );
    }
    
}
